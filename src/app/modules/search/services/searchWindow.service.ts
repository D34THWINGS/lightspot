import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Observable } from 'rxjs/Observable';

import { ResultsService } from '../../results/services/results.service';
import { IResult } from '../../results/interfaces/result.interface';

@Injectable()
export class SearchWindowService {
  private $expanded: Observable<boolean>;
  private window: Electron.BrowserWindow;
  private originalWidth: number;
  private originalHeight: number;
  private collapseTimeout: number;
  private expanded: boolean = false;
  private expandValue: number = 300;

  constructor(resultsService: ResultsService) {
    this.window = remote.getCurrentWindow();
    const { width, height } = remote.getGlobal('originalWindowSize');
    this.originalWidth = width;
    this.originalHeight = height;
    this.$expanded = resultsService.getResultsObservable()
      .filter((results: IResult[]): boolean => (results.length > 1) !== this.expanded)
      .debounceTime(200)
      .map((results: IResult[]) => {
        if (results.length <= 1 && this.expanded) {
          this.collapseWindow();
        } else {
          this.expandWindow();
        }

        return this.expanded;
      })
      .startWith(false);
  }

  public getExpandedObservable(): Observable<boolean> {
    return this.$expanded;
  }

  private collapseWindow(): void {
    this.expanded = false;
    this.collapseTimeout = window.setTimeout(() => {
      this.window.setSize(this.originalWidth, this.originalHeight);
    }, 250);
  }

  private expandWindow(): void {
    window.clearTimeout(this.collapseTimeout);
    this.window.setSize(this.originalWidth, this.originalHeight + this.expandValue);
    this.expanded = true;
  }
}
