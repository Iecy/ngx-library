import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NZ_I18N, zh_CN, NzNotificationService } from 'ng-zorro-antd';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);



import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
      path: '',
      redirectTo: 'tools',
      pathMatch: 'full'
  },
  {
      path: 'tools',
      loadChildren: () => import('./main/main.module').then(m => m.MainModule),
  },
  {
      path: 'water-marker',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule { }

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NzNotificationService, useValue: { nzDuration: 3000, nzPlacement: 'bottomRight', } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
