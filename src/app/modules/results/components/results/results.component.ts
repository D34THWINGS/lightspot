import { Component } from '@angular/core';

@Component({
  selector: 'results',
  styleUrls: ['results.styles.css'],
  template: `
    <results-list></results-list>
    <result-preview></result-preview>
  `,
})
export class ResultsComponent {}
