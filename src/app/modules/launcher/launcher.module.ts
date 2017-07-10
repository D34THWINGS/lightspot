import { NgModule } from '@angular/core';

import { GlobalModule } from '../global/global.module';
import { LauncherService } from './services/launcher.service';

@NgModule({
  imports: [GlobalModule],
  providers: [LauncherService],
})
export class LauncherModule {}
