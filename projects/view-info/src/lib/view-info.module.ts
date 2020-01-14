import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewInfoComponent } from './view-info/view-info.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ViewInfoComponent],
  exports: [ViewInfoComponent],
})
export class ViewInfoModule { }
