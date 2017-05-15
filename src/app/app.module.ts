import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './container/app.component';
import { SearchModule } from './modules/search/search.module';
import { ResultsModule } from './modules/results/results.module';

@NgModule({
  imports:      [ BrowserModule, SearchModule, ResultsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
