import { Injectable } from '@angular/core';
import { remote } from 'electron';

@Injectable()
export class SearchWindowService {

  private window: Electron.BrowserWindow;
  private expanded: boolean = false;
  private expandValue: number = 300;

  constructor() {
    this.window = remote.getCurrentWindow();
  }

  handleSearchChange(inputValue: String): void {
    if ((inputValue.length > 0) === this.expanded) {
      return;
    }

    if (inputValue.length === 0 && this.expanded) {
      return this.collapseWindow();
    }

    return this.expandWindow();
  }

  collapseWindow(): void {
    const [width, height] = this.window.getSize();
    this.window.setSize(width, height - this.expandValue);
    this.expanded = false;
  }

  expandWindow(): void {
    const [width, height] = this.window.getSize();
    this.window.setSize(width, height + this.expandValue);
    this.expanded = true;
  }
}
