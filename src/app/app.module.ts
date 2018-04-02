import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './container/app.component';
import { GlobalModule } from './modules/global/global.module';
import { ResultsModule } from './modules/results/results.module';
import { SearchModule } from './modules/search/search.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, SearchModule, ResultsModule, GlobalModule],
})
export class AppModule {
}
