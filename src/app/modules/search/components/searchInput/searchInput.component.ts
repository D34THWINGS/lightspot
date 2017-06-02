import { Component, EventEmitter } from '@angular/core';
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
      (keyup)="keyUpListener.emit($event)"
      autofocus />
  `,
})
export class SearchInputComponent {
  private $matchingText: Observable<string>;
  private $hintText: Observable<string>;
  private searchBox: FormControl = new FormControl();
  private keyUpListener: EventEmitter<KeyboardEvent> = new EventEmitter();

  constructor(searchInputService: SearchInputService, resultsService: ResultsService) {
    this.searchBox
      .valueChanges
      .subscribe((value) => searchInputService.pushValue(value));

    const $firstResultTitle = resultsService.getResultsObservable()
      .map((results: IResult[]): string => results[0] ? results[0].title : null);

    this.$matchingText = $firstResultTitle.combineLatest(
      searchInputService.getInputObservable(),
      (title: string, value: string): string =>
        (!title || !this.startsWith(title, value)) ? value : value + title.slice(value.length),
    );
    this.$hintText = $firstResultTitle.combineLatest(
      searchInputService.getInputObservable(),
      (title: string, value: string): string => (title && !this.startsWith(title, value)) ? title : '',
    );

    // Handle escape key
    const $escapeKey = searchInputService.getInputObservable()
      .sample(this.keyUpListener.filter((e: KeyboardEvent): boolean => e.keyCode === 27))
      .do((value: string): void => {
        if (!value) {
          window.close();
        }
      })
      .mapTo('');

    // Handle right key
    const $rightKey = this.$matchingText
      .combineLatest(searchInputService.getInputObservable(), (matching: string, value: string): string => {
        return matching === value ? value : matching;
      })
      .sample(this.keyUpListener.filter((e: KeyboardEvent): boolean => e.keyCode === 39));

    // Pipe input modifiers
    Observable.merge($escapeKey, $rightKey).subscribe((value: string): void => this.searchBox.setValue(value));
  }

  private startsWith(a: string, b: string): boolean {
    return (new RegExp(`^${b}`, 'i')).test(a);
  }
}
