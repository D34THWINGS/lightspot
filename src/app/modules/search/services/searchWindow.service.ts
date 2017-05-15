import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SearchWindowService {
  public $expanded: Subject<boolean> = new Subject();

  private collapseTimeout: number;
  private window: Electron.BrowserWindow;
  private expanded: boolean = false;
  private expandValue: number = 300;

  constructor() {
    this.window = remote.getCurrentWindow();
    this.$expanded.next(this.expanded);
  }

  public handleSearchChange(inputValue: string): void {
    if ((inputValue.length > 0) === this.expanded) {
      return;
    }

    if (inputValue.length === 0 && this.expanded) {
      this.collapseWindow();
    } else {
      this.expandWindow();
    }

    this.$expanded.next(this.expanded);
  }

  public collapseWindow(): void {
    const [width, height] = this.window.getSize();
    this.expanded = false;
    this.collapseTimeout = window.setTimeout(() => this.window.setSize(width, height - this.expandValue), 250);
  }

  public expandWindow(): void {
    window.clearTimeout(this.collapseTimeout);
    const [width, height] = this.window.getSize();
    this.window.setSize(width, height + this.expandValue);
    this.expanded = true;
  }
}
