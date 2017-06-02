import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalculatorModule } from '../calculator/calculator.module';
import { ResultPreviewComponent } from './components/resultPreview/resultPreview.component';
import { ResultsComponent } from './components/results/results.component';
import { ResultsListComponent } from './components/resultsList/resultsList.component';
import { ResultsListItemComponent } from './components/resultsListItem/resultsListItem.component';
import { ResultsService } from './services/results.service';

@NgModule({
  declarations: [ResultsComponent, ResultsListComponent, ResultsListItemComponent, ResultPreviewComponent],
  exports: [ResultsComponent],
  imports: [CommonModule, CalculatorModule],
  providers: [ResultsService],
})
export class ResultsModule {}
