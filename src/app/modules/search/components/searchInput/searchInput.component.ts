import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchWindowService } from '../../services/searchWindow.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'search-input',
  styleUrls: ['searchInput.styles.css'],
  template: `
    <input
      class="search-input"
      placeholder="What can LightSpot do for you ?"
      [formControl]="searchBox"
      #searchInput
      (keyup)="handleKeyUp($event, searchInput.value)"
      autofocus />
  `,
})
export class SearchInputComponent {
  private searchBox: FormControl = new FormControl();

  constructor(private searchWindowService: SearchWindowService) {
    this.searchBox
      .valueChanges
      .debounceTime(200)
      .subscribe((event) => searchWindowService.handleSearchChange(event));
  }

  private handleKeyUp(e: KeyboardEvent, value: string) {
    if (e.keyCode !== 27) {
      return;
    }

    if (value) {
      this.searchBox.setValue('');
    } else {
      window.close();
    }
  }
}
