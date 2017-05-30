import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './container/app.component';
import { ResultsModule } from './modules/results/results.module';
import { SearchModule } from './modules/search/search.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, SearchModule, ResultsModule],
})
export class AppModule {
}
