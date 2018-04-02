import { NgModule } from '@angular/core';

import { AppWindowService } from './services/appWindow.service';
import { SearchInputService } from './services/searchInput.service';

@NgModule({
  providers: [SearchInputService, AppWindowService],
})
export class GlobalModule {}
