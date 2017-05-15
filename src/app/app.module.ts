import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './container/app.component';
import { ResultsModule } from './modules/results/results.module';
import { SearchModule } from './modules/search/search.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, SearchModule, ResultsModule],
})
export class AppModule {
}
