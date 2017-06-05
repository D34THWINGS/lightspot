import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import { CalculatorService } from '../../calculator/services/calculator.service';
import { IResult } from '../interfaces/result.interface';

@Injectable()
export class ResultsService {
  private $results: Observable<IResult[]>;

  constructor(calculatorService: CalculatorService) {
    const resultsObservables = {
      calc: calculatorService.getResultsObservable(),
    };

    this.$results = Observable
      .create((subscriber: Subscriber<object>) => {
        const results = {};

        Object.keys(resultsObservables).forEach((key: string) => {
          resultsObservables[key].subscribe(
            (r: IResult[]) => {
              results[key] = r;
              subscriber.next([].concat(...Object.keys(results).map((k: string): IResult[] => results[key])));
            },
            (err: Error) => subscriber.error(err),
            () => subscriber.complete(),
          );
        });
      })
      .startWith([])
      .share();
  }

  public getResultsObservable() {
    return this.$results;
  }
}
