import { Component, Input } from '@angular/core';

import { IResult } from '../../interfaces/result.interface';

@Component({
  selector: 'results-list-item',
  styleUrls: ['resultsListItem.styles.css'],
  template: `
    <div class="result-item__icon">
      <img [src]="result.icon" class="result-item__img" />
    </div>
    <div class="result-item__title">{{result.title}}</div>
  `,
})
export class ResultsListItemComponent {
  @Input('result') private result: IResult;
}
