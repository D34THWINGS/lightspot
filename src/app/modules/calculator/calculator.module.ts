import { NgModule } from '@angular/core';

import { GlobalModule } from '../global/global.module';
import { CalculatorService } from './services/calculator.service';

@NgModule({
  imports: [GlobalModule],
  providers: [CalculatorService],
})
export class CalculatorModule {}
