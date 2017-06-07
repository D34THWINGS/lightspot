import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/Rx';

@Injectable()
export class SearchInputService {
  private $inputValue: BehaviorSubject<string> = new BehaviorSubject(localStorage.getItem('lastSearch') || '');
  private $outputValue: ConnectableObservable<string>;

  constructor() {
    this.$outputValue = this.$inputValue
      .asObservable()
      .delay(1)
      .do((value: string): void => {
        localStorage.setItem('lastSearch', value);
      })
      .publish();
  }

  public pushValue(value: string): void {
    this.$inputValue.next(value);
  }

  public getInputObservable(): ConnectableObservable<string> {
    return this.$outputValue;
  }
}
