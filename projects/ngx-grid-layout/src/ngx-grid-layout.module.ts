import { NgModule } from '@angular/core';
import { NgxGridLayoutComponent } from './ngx-grid-layout.component';
import { NgxGridItemComponent } from './ngx-grid-item.component';
import { NgxGridLayoutService } from './ngx-grid-layout.service';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NgxGridLayoutComponent, 
    NgxGridItemComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgxGridLayoutComponent,
    NgxGridItemComponent,
  ],
  providers: [
    NgxGridLayoutService
  ]
})
export class NgxGridLayoutModule { }
