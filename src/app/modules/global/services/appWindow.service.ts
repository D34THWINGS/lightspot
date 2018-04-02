import { Injectable } from '@angular/core';
import { ipcRenderer, remote } from 'electron';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppWindowService {
  private $visibility: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private $visibilityObservable: Observable<boolean>;
  private window: Electron.BrowserWindow;
  private previousWidth: number;
  private previousHeight: number;

  constructor() {
    this.window = remote.getCurrentWindow();
    this.previousWidth = 0;
    this.previousHeight = 0;

    ipcRenderer.on('toggle-visibility', () => {
      this.setVisibility(!this.window.isVisible());
    });

    if (process.env.NODE_ENV === 'production') {
      // Handle blur from window
      window.addEventListener('blur', () => {
        this.setVisibility(false);
      });
    }

    // Handle click in empty space
    document.addEventListener('click', (e: MouseEvent) => {
      if (e.target === document.body) {
        this.setVisibility(false);
      }
    });

    this.$visibilityObservable = this.$visibility.asObservable().share();
  }

  public setVisibility(visible: boolean): void {
    this.$visibility.next(visible);
    if (visible) {
      this.window.show();
    } else {
      this.window.hide();
    }
  }

  public getVisibilityObservable(): Observable<boolean> {
    return this.$visibilityObservable;
  }
}
