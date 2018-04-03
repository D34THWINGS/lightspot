import { Component, EventEmitter, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { remote } from 'electron';

import { AppWindowService } from '../../../global/services/appWindow.service';
import { ResultsService } from './../../../results/services/results.service';

@Component({
  selector: 'search',
  styleUrls: ['search.styles.css'],
  template: `
    <form class="search__form" [formGroup]="searchForm" (ngSubmit)="submitListener.emit()">
      <search-icon></search-icon>
      <search-input></search-input>
    </form>`,
})
export class SearchComponent {
  private window: Electron.BrowserWindow;
  private searchInput: HTMLElement;
  private submitListener: EventEmitter<void> = new EventEmitter();
  private searchForm: FormGroup = new FormGroup({});

  constructor(resultsService: ResultsService, appWindowService: AppWindowService) {
    this.window = remote.getCurrentWindow();

    this.submitListener.withLatestFrom(resultsService.getResultsObservable())
      .subscribe(([_, results]) => {
        if (results.length > 0) {
          results[0].action();
          appWindowService.setVisibility(false);
        }
      });
  }

  @HostListener('click')
  public onMouseClick() {
    if (!this.searchInput) {
      this.searchInput = document.querySelector('.search-input__input') as HTMLElement;
    }

    this.searchInput.focus();
  }
}
