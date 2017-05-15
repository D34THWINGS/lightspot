import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchWindowService } from '../../services/searchWindow.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'search-input',
  styleUrls: ['searchInput.styles.css'],
  template: `<input class="search-input" placeholder="What can LightSpot do for you ?" [formControl]="searchBox" />`,
})
export class SearchInputComponent {
  private searchBox: FormControl = new FormControl();

  constructor(private searchWindowService: SearchWindowService) {
    this.searchBox
      .valueChanges
      .debounceTime(200)
      .subscribe(event => searchWindowService.handleSearchChange(event));
  }
}
