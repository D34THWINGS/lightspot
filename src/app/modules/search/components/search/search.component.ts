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

  constructor(private searchElement: ElementRef) {
    this.window = remote.getCurrentWindow();
  }

  @HostListener('click')
  public onMouseClick() {
    const searchInput = document.querySelector('.search-input') as HTMLElement;
    searchInput.focus();
  }

  @HostListener('mousedown', ['$event'])
  public handleWindowDrag(ep: MouseEvent) {
    const { pageX, pageY } = ep;
    let dragging = false;

    const moveListener = () => {
      const { x, y } = getMousePos();
      this.window.setPosition(x - pageX, y - pageY);

      if (dragging) {
        window.requestAnimationFrame(moveListener);
      }
    };

    dragging = true;
    window.requestAnimationFrame(moveListener);

    this.searchElement.nativeElement.addEventListener('mouseup', () => {
      dragging = false;
    }, { once: true });
  }
}
