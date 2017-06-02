import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CalculatorService } from '../../calculator/services/calculator.service';
import { IResult } from '../interfaces/result.interface';

@Injectable()
export class ResultsService {
  private $results: Observable<IResult[]>;

  constructor(calculatorService: CalculatorService) {
    this.$results = Observable
      .merge(calculatorService.getResultsObservable())
      .startWith([]);
  }

  public getResultsObservable() {
    return this.$results;
  }
}
