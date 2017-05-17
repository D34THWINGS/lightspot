import { Component, ElementRef, HostListener } from '@angular/core';
import { remote } from 'electron';

const getMousePos: () => { x: number, y: number } = remote.getGlobal('getMousePos');

@Component({
  selector: 'search',
  styleUrls: ['search.styles.css'],
  template: `
    <search-icon></search-icon>
    <search-input></search-input>`,
})
export class SearchComponent {
  private window: Electron.BrowserWindow;
  private searchInput: HTMLElement;

  constructor(private searchElement: ElementRef) {
    this.window = remote.getCurrentWindow();
  }

  @HostListener('click')
  public onMouseClick() {
    if (!this.searchInput) {
      this.searchInput = document.querySelector('.search-input') as HTMLElement;
    }

    this.searchInput.focus();
  }
}
