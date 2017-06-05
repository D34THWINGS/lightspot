import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SearchInputService } from '../../global/services/searchInput.service';
import { IResult } from '../../results/interfaces/result.interface';

@Injectable()
export class CalculatorService {
  private $results: Observable<IResult[]>;
  private calculusMatcher = /^[0-9]+(?:\s*[-+\/*%]\s*[0-9]+)+$/;

  constructor(searchInputService: SearchInputService) {
    this.$results = searchInputService.getInputObservable()
      .map((value: string): IResult[] => {
        if (value.length === 0 || !this.calculusMatcher.test(value)) {
          return [];
        }

        return [{
          // tslint:disable-next-line:no-eval
          title: eval(value),
        }];
      })
      .startWith([])
      .share();
  }

  public getResultsObservable() {
    return this.$results;
  }
}
