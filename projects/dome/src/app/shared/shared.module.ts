import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule} from 'ant-reset-private';
import { CookieModule } from 'cookie';
import { LoggerModule } from 'logger';
import { LayoutMenusModule } from 'layout-menus';
import { WaterMarkerModule } from 'water-marker';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CookieModule.forRoot(),
    LoggerModule.forRoot(),
    LayoutMenusModule,
    WaterMarkerModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CookieModule,
    LoggerModule,
    LayoutMenusModule,
    WaterMarkerModule,
  ]
})
export class SharedModule { }
