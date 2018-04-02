import { Component, ElementRef, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AppWindowService } from '../../../global/services/appWindow.service';
import { SearchInputService } from '../../../global/services/searchInput.service';
import { IResult } from '../../../results/interfaces/result.interface';
import { ResultsService } from '../../../results/services/results.service';

@Component({
  selector: 'search-input',
  styleUrls: ['searchInput.styles.css'],
  template: `
    <div class="search-input__autocomplete">
      <span class="search-input__matching">{{$matchingText | async}}</span>
      <span class="{{$hintClass | async}}">{{$hintText | async}}</span>
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
  private $hintClass: Observable<string>;
  private searchBox: FormControl = new FormControl();
  private keyUpListener: EventEmitter<KeyboardEvent> = new EventEmitter();

  constructor(
    searchInputService: SearchInputService,
    resultsService: ResultsService,
    appWindowService: AppWindowService,
    elementRef: ElementRef,
  ) {
    this.searchBox
      .valueChanges
      .subscribe((value) => searchInputService.pushValue(value));

    const $inputValue = searchInputService.getInputObservable();
    $inputValue.connect();

    const $firstResultTitle = resultsService.getResultsObservable()
      .map((results: IResult[]): string => results[0] ? results[0].title : null);

    this.$matchingText = $firstResultTitle.combineLatest(
      $inputValue,
      (title: string, value: string): string =>
        (!title || !this.startsWith(title, value)) ? value : value + title.slice(value.length),
    );
    this.$hintText = $firstResultTitle.combineLatest(
      $inputValue,
      (title: string, value: string): string => (title && !this.startsWith(title, value)) ? title : '',
    );
    this.$hintClass = resultsService.getResultsObservable()
      .map(([result]: IResult[]): string => `search-input__hint${!result || result.removeDash ? '' : '--dashed'}`);

    // Handle escape key
    const $escapeKey = this.keyUpListener
      .filter((e: KeyboardEvent): boolean => e.keyCode === 27)
      .do((): void => {
        if (!this.searchBox.value) {
          appWindowService.setVisibility(false);
        }
      })
      .mapTo('');

    // Handle right key
    const $rightKey = this.$matchingText
      .sample(this.keyUpListener.filter((e: KeyboardEvent): boolean => e.keyCode === 39))
      .filter((matching: string): boolean => matching !== this.searchBox.value);

    // Pipe input modifiers
    Observable.merge($escapeKey, $rightKey, $inputValue.first())
      .subscribe((value: string): void => this.searchBox.setValue(value));

    // Handle focus back on lightspot
    appWindowService.getVisibilityObservable()
      .filter((visible) => visible)
      .subscribe(() => {
        elementRef.nativeElement.querySelector('.search-input__input').focus();
      });
  }

  private startsWith(a: string, b: string): boolean {
    const escaped = b.replace(/[\-\[\]\/{}()*+?.\\^$|]/g, '\\$&');
    return (new RegExp(`^${escaped}`, 'i')).test(a);
  }
}
