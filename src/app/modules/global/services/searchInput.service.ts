import { Injectable } from '@angular/core';
import { remote } from 'electron';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchInputService {
  private $inputValue: BehaviorSubject<string> = new BehaviorSubject('');

  public pushValue(value: string): void {
    this.$inputValue.next(value);
  }

  public getInputObservable(): Observable<string> {
    return this.$inputValue.asObservable();
  }
}
