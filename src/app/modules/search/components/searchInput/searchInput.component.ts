import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { SearchInputService } from '../../../global/services/searchInput.service';
import { IResult } from '../../../results/interfaces/result.interface';
import { ResultsService } from '../../../results/services/results.service';

@Component({
  selector: 'search-input',
  styleUrls: ['searchInput.styles.css'],
  template: `
    <div class="search-input__autocomplete">
      <span class="search-input__matching">{{$matchingText | async}}</span>
      <span class="search-input__hint">{{$hintText | async}}</span>
    </div>
    <input
      class="search-input__input"
      placeholder="What can LightSpot do for you ?"
      [formControl]="searchBox"
      #searchInput
      (keyup)="handleKeyUp($event, searchInput.value)"
      autofocus />
  `,
})
export class SearchInputComponent {
  private $matchingText: Observable<string>;
  private $hintText: Observable<string>;
  private searchBox: FormControl = new FormControl();

  constructor(searchInputService: SearchInputService, resultsService: ResultsService) {
    this.searchBox
      .valueChanges
      .subscribe((value) => searchInputService.pushValue(value));

    const firstResult$ = resultsService.getResultsObservable()
      .map((results: IResult[]): string => results[0] ? results[0].title : null);

    this.$matchingText = firstResult$.combineLatest(
      searchInputService.getInputObservable(),
      (title: string, value: string): string => (!title || !title.startsWith(value)) ? value : title,
    );
    this.$hintText = firstResult$.combineLatest(
      searchInputService.getInputObservable(),
      (title: string, value: string): string => (title && !title.startsWith(value)) ? title : '',
    );
  }

  private handleKeyUp(e: KeyboardEvent, value: string) {
    if (e.keyCode !== 27) {
      return;
    }

    // Handle escape key
    if (value) {
      this.searchBox.setValue('');
    } else {
      window.close();
    }
  }
}
