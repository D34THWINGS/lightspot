import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SearchInputService } from '../../global/services/searchInput.service';
import { IResult } from '../../results/interfaces/result.interface';

@Injectable()
export class CalculatorService {
  private $results: Observable<IResult[]>;

  constructor(searchInputService: SearchInputService) {
    this.$results = searchInputService.getInputObservable()
      .map((value: string): IResult[] => value.length === 0 ? [] : [{
        title: `xX_${value}_Xx`,
      }])
      .startWith([]);
  }

  public getResultsObservable() {
    return this.$results;
  }
}
