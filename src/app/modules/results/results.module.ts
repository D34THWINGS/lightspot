import { NgModule } from '@angular/core';

import { ResultPreviewComponent } from './components/resultPreview/resultPreview.component';
import { ResultsComponent } from './components/results/results.component';
import { ResultsListComponent } from './components/resultsList/resultsList.component';

@NgModule({
  declarations: [ResultsComponent, ResultsListComponent, ResultPreviewComponent],
  exports: [ResultsComponent],
})
export class ResultsModule {}
