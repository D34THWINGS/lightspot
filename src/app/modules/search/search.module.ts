import { NgModule }      from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchIconComponent }  from './components/searchIcon/searchIcon.component';
import { SearchInputComponent }  from './components/searchInput/searchInput.component';
import { SearchComponent } from './components/search/search.component';
import { SearchWindowService } from './services/searchWindow.service';

@NgModule({
  imports: [ ReactiveFormsModule ],
  providers: [ SearchWindowService ],
  declarations: [ SearchIconComponent, SearchInputComponent, SearchComponent ],
  exports: [ SearchComponent ]
})
export class SearchModule { }
