import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowDataComponent } from './show-data/show-data.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'src/app/_layout/breadcrumb/breadcrumb.module';
import { FormsModule } from '@angular/forms';
import { CardModule } from '../partials/general/card/card.module';
import { MatchHeightModule } from '../partials/general/match-height/match-height.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from 'src/app/_layout/blockui/block-template.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    ShowDataComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    FormsModule,
    CardModule,
    MatchHeightModule,
    NgbModule,
    ChartsModule,
    BlockUIModule.forRoot({
      template: BlockTemplateComponent
    }),
    RouterModule.forChild([
      {
        path: 'show-data',
        component: ShowDataComponent,
      },
    ]),
  ],
  exports: [RouterModule]
})
export class DashboardModule { }
