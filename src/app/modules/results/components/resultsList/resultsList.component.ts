import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IResult } from '../../interfaces/result.interface';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'results-list',
  styleUrls: ['resultsList.styles.css'],
  template: `<results-list-item *ngFor="let result of $results | async" [result]="result"></results-list-item>`,
})
export class ResultsListComponent {
  private $results: Observable<IResult[]>;

  constructor(resultsService: ResultsService) {
    this.$results = resultsService.getResultsObservable();
  }
}
