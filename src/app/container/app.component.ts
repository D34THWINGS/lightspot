import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

import { SearchWindowService } from '../modules/search/services/searchWindow.service';

@Component({
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(150),
      ]),
    ]),
  ],
  host: { '[class]': 'lightspotClass', '[@fadeIn]': '' },
  selector: 'lightspot',
  styleUrls: ['app.styles.css'],
  template: `
    <search></search>
    <results></results>
  `,
})
export class AppComponent {
  private lightspotClass: string;

  constructor(searchWindowService: SearchWindowService) {
    searchWindowService.getExpandedObservable()
      .subscribe((expanded) => {
        this.lightspotClass = expanded ? 'lightspot--expanded' : 'lightspot--collapsed';
      });
  }
}
