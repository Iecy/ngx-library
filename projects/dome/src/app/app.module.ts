import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
// import { SharedModule } from 'shared/shared.module';
import { SharedModule } from './shared/shared.module';
import { NZ_I18N, zh_CN, NZ_NOTIFICATION_CONFIG } from 'ant-reset-private';

import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
      path: '',
      redirectTo: 'tools',
      pathMatch: 'full'
  },
  {
      path: 'tools',
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
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzDuration: 3000, nzPlacement: 'bottomRight', } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
