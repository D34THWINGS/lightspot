import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalculatorModule } from '../calculator/calculator.module';
import { ResultPreviewComponent } from './components/resultPreview/resultPreview.component';
import { ResultsComponent } from './components/results/results.component';
import { ResultsListComponent } from './components/resultsList/resultsList.component';
import { ResultsListItemComponent } from './components/resultsListItem/resultsListItem.component';
import { ResultsService } from './services/results.service';
import { LauncherModule } from '../launcher/launcher.module';

@NgModule({
  declarations: [ResultsComponent, ResultsListComponent, ResultsListItemComponent, ResultPreviewComponent],
  exports: [ResultsComponent],
  imports: [CommonModule, CalculatorModule, LauncherModule],
  providers: [ResultsService],
})
export class ResultsModule {}
