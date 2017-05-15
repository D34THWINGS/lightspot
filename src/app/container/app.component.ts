import { Component, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SearchWindowService } from '../modules/search/services/searchWindow.service';

@Component({
  selector: 'lightspot',
  template: `
    <search></search>
    <results-list></results-list>
  `,
  styleUrls: ['app.styles.css'],
  host: { '[class]': 'lightspotClass' },
})
export class AppComponent {
  private lightspotClass: string;

  constructor(searchWindowService: SearchWindowService) {
    searchWindowService.$expanded
      .startWith(false)
      .subscribe(expanded => {
        this.lightspotClass = expanded ? 'lightspot--expanded' : 'lightspot--collapsed';
      });
  }
}
