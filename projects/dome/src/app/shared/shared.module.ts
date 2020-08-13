import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NzButtonModule, NzInputModule, NzLayoutModule, NzSelectModule, NzFormModule} from 'ng-zorro-antd';
// import { NgZorroAntdModule } from 'ng-zorro-antd';
// import { } from 'ng-zorro-antd/buttons';
import { CookieModule } from 'cookie';
import { LoggerModule } from 'logger';
import { LayoutMenusModule } from 'layout-menus';
import { WaterMarkerModule } from 'water-marker';
import { ViewInfoModule } from 'view-info';
import { FullscreenModule } from 'fullscreen';
import { AngularCreatePdfModule } from 'angular-create-pdf';
import { NgxGridLayoutModule } from 'ngx-grid-layout';
import { NgxAceModule } from 'ngx-ace';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // NgZorroAntdModule,
    NzButtonModule,
    NzLayoutModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    CookieModule.forRoot(),
    LoggerModule.forRoot(),
    LayoutMenusModule,
    WaterMarkerModule,
    ViewInfoModule,
    FullscreenModule,
    AngularCreatePdfModule,
    NgxGridLayoutModule,
    NgxAceModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    // NgZorroAntdModule,
    NzButtonModule,
    NzLayoutModule,
    NzSelectModule,
    NzInputModule,
    NzFormModule,
    CookieModule,
    LoggerModule,
    LayoutMenusModule,
    WaterMarkerModule,
    ViewInfoModule,
    FullscreenModule,
    NgxGridLayoutModule,
    NgxAceModule,
  ]
})
export class SharedModule { }
