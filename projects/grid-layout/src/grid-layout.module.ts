import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridLayoutComponent } from './grid-layout.component';
import { GridItemComponent } from './grid-item.component';
import { GridItemDirective } from './grid-item.directive';
import { GridBodyComponent } from './grid-body.component';

import { GridLayoutService } from './grid-layout.service';

@NgModule({
  declarations: [
    GridLayoutComponent,
    GridItemComponent,
    GridBodyComponent,

    GridItemDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    GridLayoutComponent,
    GridItemComponent,
    GridBodyComponent,

    GridItemDirective,
  ],
  providers: [
    GridLayoutService
  ]
})
export class GridLayoutModule { }
