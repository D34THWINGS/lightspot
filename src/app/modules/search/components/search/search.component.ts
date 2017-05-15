import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'search',
  template: `
      <search-icon></search-icon>
      <search-input></search-input>`,
  styleUrls: [ 'search.styles.css' ],
})
export class SearchComponent {
  @HostListener('click') onMouseClick() {
    const searchInput = document.querySelector('.search-input') as HTMLElement;
    searchInput.focus();
  }
}
