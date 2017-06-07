import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SearchInputService } from '../../global/services/searchInput.service';
import { IResult } from '../../results/interfaces/result.interface';

@Injectable()
export class CalculatorService {
  private $results: Observable<IResult[]>;
  private calculusMatcher = /^(?:[0-9]+|\s*|[-+\/*%^]|(?:sqrt|sin|cos|tan)\(|\(|\))+$/i;

  constructor(searchInputService: SearchInputService) {
    this.$results = searchInputService.getInputObservable()
      .map((value: string): IResult[] => {
        if (value.length === 0 || !this.calculusMatcher.test(value)) {
          return [];
        }

        const formattedValue = value
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .replace(
            /\d\s\d|\d\s?[a-z]|\)\s?(\(|\w)|(\)|\d)\s?\(/g,
            (match: string) => `${match.slice(0, 1)}*${match.slice(-1)}`,
          )
          .replace(/sqrt|sin|cos|tan/ig, (match: string): string => `Math.${match}`)
          .replace(/\^/g, '**');

        try {
          // tslint:disable-next-line:no-eval
          const result = eval(formattedValue);
          return isNaN(result) ? [] : [{
            removeDash: true,
            title: `= ${result}`,
          }];
        } catch (e) {
          return [];
        }
      })
      .startWith([])
      .share();
  }

  public getResultsObservable() {
    return this.$results;
  }
}
