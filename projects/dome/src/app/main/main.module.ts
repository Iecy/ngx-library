import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { LoggerComponent } from './logger/logger.component';
import { FullScreenComponent } from './full-screen/full-screen.component';
import { ViewInfoComponent } from './view-info/view-info.component';
import { AngularCreatePdfComponent } from './angular-create-pdf/angular-create-pdf.component';
import { GridLayoutComponent } from './grid-layout/grid-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cookie',
    pathMatch: 'full'
  },
  {
    path: 'cookie',
    component: MainComponent,
  },
  {
    path: 'logger',
    component: LoggerComponent
  },
  {
    path: 'full-screen',
    component: FullScreenComponent
  },
  {
    path: 'view-info',
    component: ViewInfoComponent,
  },
  {
    path: 'angular-create-pdf',
    component: AngularCreatePdfComponent,
  },
  {
    path: 'grid-layout',
    component: GridLayoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }

@NgModule({
  declarations: [
    MainComponent,
    LoggerComponent,
    FullScreenComponent,
    ViewInfoComponent,
    AngularCreatePdfComponent,
    GridLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
  ]
})
export class MainModule { }
