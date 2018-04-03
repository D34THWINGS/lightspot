import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import * as fs from 'fs';
import { filter, FilterResult } from 'fuzzy';
import { Observable } from 'rxjs/Observable';

import { SearchInputService } from '../../global/services/searchInput.service';
import { IResult } from '../../results/interfaces/result.interface';
import { IApplication } from '../interfaces/application.interface';

@Injectable()
export class LauncherService {
  private $results: Observable<IResult[]>;
  private $applications: Observable<IApplication[]>;

  constructor(searchInputService: SearchInputService) {
    this.$applications = Observable.fromEvent(ipcRenderer, '@launcher:indexed', (e, arg) => arg);
    this.$results = searchInputService.getInputObservable()
      .combineLatest(this.$applications, (value: string, apps: IApplication[]): IResult[] =>
        filter(value, apps, { extract: (app: IApplication): string => app.name })
          .filter((match: FilterResult<IApplication>): boolean => match.score > 0.5)
          .sort((a: FilterResult<IApplication>, b: FilterResult<IApplication>): number => b.score - a.score)
          .map((match: FilterResult<IApplication>): IResult => ({
            removeDash: false,
            title: match.original.name,
            action() {
              ipcRenderer.send('@launcher:launch', match.original.path);
            },
          })))
      .startWith([])
      .share();

    this.indexApplications();
  }

  public getResultsObservable() {
    return this.$results;
  }

  public indexApplications() {
    ipcRenderer.send('@launcher:index');
  }
}
