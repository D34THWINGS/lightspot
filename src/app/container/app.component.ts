import { Component, HostBinding } from '@angular/core';

import { SearchWindowService } from '../modules/search/services/searchWindow.service';

@Component({
  host: { '[class]': 'lightspotClass' },
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
    searchWindowService.$expanded
      .startWith(false)
      .subscribe((expanded) => {
        this.lightspotClass = expanded ? 'lightspot--expanded' : 'lightspot--collapsed';
      });
  }
}
