import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchComponent } from './components/search/search.component';
import { SearchIconComponent } from './components/searchIcon/searchIcon.component';
import { SearchInputComponent } from './components/searchInput/searchInput.component';
import { SearchWindowService } from './services/searchWindow.service';

@NgModule({
  declarations: [SearchIconComponent, SearchInputComponent, SearchComponent],
  exports: [SearchComponent],
  imports: [ReactiveFormsModule],
  providers: [SearchWindowService],
})
export class SearchModule {}
