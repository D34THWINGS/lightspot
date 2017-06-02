import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GlobalModule } from '../global/global.module';
import { ResultsModule } from '../results/results.module';
import { SearchComponent } from './components/search/search.component';
import { SearchIconComponent } from './components/searchIcon/searchIcon.component';
import { SearchInputComponent } from './components/searchInput/searchInput.component';
import { SearchWindowService } from './services/searchWindow.service';

@NgModule({
  declarations: [SearchIconComponent, SearchInputComponent, SearchComponent],
  exports: [SearchComponent],
  imports: [ReactiveFormsModule, CommonModule, GlobalModule, ResultsModule],
  providers: [SearchWindowService],
})
export class SearchModule {}
