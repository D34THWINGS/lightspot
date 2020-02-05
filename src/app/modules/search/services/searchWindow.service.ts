import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Observable } from 'rxjs/Observable';

import { IResult } from '../../results/interfaces/result.interface';
import { ResultsService } from '../../results/services/results.service';

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
      .debounceTime(200)
      .map((results: IResult[]) => {
        if (results.length <= 1) {
          this.collapseWindow();
        } else {
          this.expandWindow();
        }

        return this.expanded;
      })
      .startWith(false)
      .share();
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
