import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LayoutMenusModule } from 'layout-menus';
import { NZ_I18N, zh_CN, NZ_NOTIFICATION_CONFIG, NgZorroAntdModule } from 'ant-reset-private';

import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
      path: '',
      redirectTo: 'main',
      pathMatch: 'full'
  },
  {
      path: 'main',
      loadChildren: './main/main.module#MainModule',
  },
  {
      path: 'water-marker',
      loadChildren: './home/home.module#HomeModule',
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
})
export class AppRoutingModule { }

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    NgZorroAntdModule,
    BrowserModule,
    AppRoutingModule,
    LayoutMenusModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzDuration: 3000, nzPlacement: 'bottomRight', } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
