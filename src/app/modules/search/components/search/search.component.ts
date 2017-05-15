import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'search',
  styleUrls: ['search.styles.css'],
  template: `
    <search-icon></search-icon>
    <search-input></search-input>`,
})
export class SearchComponent {
  @HostListener('click')
  public onMouseClick() {
    const searchInput = document.querySelector('.search-input') as HTMLElement;
    searchInput.focus();
  }
}
