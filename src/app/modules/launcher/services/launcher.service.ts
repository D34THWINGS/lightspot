import { Injectable } from '@angular/core';
import * as fs from 'fs';
import { filter, FilterResult } from 'fuzzy';
import { Observable } from 'rxjs/Observable';

import { SearchInputService } from '../../global/services/searchInput.service';
import { IResult } from '../../results/interfaces/result.interface';
import { IApplication } from '../interfaces/application.interface';

function promisify<T>(func: any): (...args: any[]) => Promise<T> {
  return (...args: any[]) => new Promise((resolve, reject) => {
    func(...args, (err: Error, value: T) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(value);
    });
  });
}

const stat = promisify<fs.Stats>(fs.stat);
const readdir = promisify<string[]>(fs.readdir);

@Injectable()
export class LauncherService {
  private $results: Observable<IResult[]>;
  private applications: IApplication[];

  constructor(searchInputService: SearchInputService) {
    this.$results = searchInputService.getInputObservable()
      .map((value: string): IResult[] => {
        return filter(value, this.applications, {
          extract: (app: IApplication): string => app.name,
        })
          .filter((match: FilterResult<IApplication>): boolean => match.score > 0.5)
          .sort((a: FilterResult<IApplication>, b: FilterResult<IApplication>): number => b.score - a.score)
          .map((match: FilterResult<IApplication>): IResult => ({
            removeDash: false,
            title: match.original.name,
          }));
      })
      .startWith([])
      .share();

    this.indexApplications();
  }

  public getResultsObservable() {
    return this.$results;
  }

  public indexApplications() {
    this.applications = [];
    this.recursiveIndexing('/Applications')
      .then((apps: string[]) => {
        this.applications = this.recursiveFlatten(apps)
          .map((app) => ({
            name: app.match(/.+\/(.+)\.app$/)[1],
            path: app,
          }));
      });
  }

  private recursiveIndexing(path: string): Promise<any> {
    return readdir(path).then((files: string[]) => {
      return Promise.all(files.map((file) => {
        if (/\.app$/.test(file)) {
          return Promise.resolve(`${path}/${file}`);
        }

        if (/\.[\w]+$/.test(file)) {
          return Promise.resolve();
        }

        return stat(`${path}/${file}`).then((fileStats: fs.Stats) => {
          if (fileStats.isDirectory()) {
            return this.recursiveIndexing(`${path}/${file}`);
          }

          return Promise.resolve();
        });
      }));
    });
  }

  private recursiveFlatten(tmpApps: string[]): string[] {
    return tmpApps.reduce((acc, app) => {
      if (Array.isArray(app)) {
        acc.push(...this.recursiveFlatten(app));
      } else if (typeof app === 'undefined') {
        return acc;
      } else {
        acc.push(app);
      }

      return acc;
    }, []);
  }
}
