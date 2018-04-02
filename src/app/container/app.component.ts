import { animate, style, transition, trigger } from '@angular/animations';
import { ApplicationRef, Component } from '@angular/core';

import { AppWindowService } from '../modules/global/services/appWindow.service';
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

  constructor(searchWindowService: SearchWindowService, appWindowService: AppWindowService, ref: ApplicationRef) {
    searchWindowService.getExpandedObservable()
      .combineLatest(appWindowService.getVisibilityObservable(), (expanded, visible) => {
        if (!visible) {
          return 'lightspot--hidden';
        }

        return expanded ? 'lightspot--expanded' : 'lightspot--collapsed';
      })
      .subscribe((className) => {
        this.lightspotClass = className;
        ref.tick();
      });
  }
}
