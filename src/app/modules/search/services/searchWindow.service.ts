import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SearchWindowService {
  public $expanded: Subject<boolean> = new Subject();

  private window: Electron.BrowserWindow;
  private originalWidth: number;
  private originalHeight: number;
  private collapseTimeout: number;
  private expanded: boolean = false;
  private expandValue: number = 300;

  constructor() {
    this.window = remote.getCurrentWindow();
    const { width, height } = remote.getGlobal('originalWindowSize');
    this.originalWidth = width;
    this.originalHeight = height;
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
    this.expanded = false;
    this.collapseTimeout = window.setTimeout(() => {
      this.window.setSize(this.originalWidth, this.originalHeight);
    }, 250);
  }

  public expandWindow(): void {
    window.clearTimeout(this.collapseTimeout);
    this.window.setSize(this.originalWidth, this.originalHeight + this.expandValue);
    this.expanded = true;
  }
}
