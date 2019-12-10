import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { LoggerComponent } from './logger/logger.component';
import { FullScreenComponent } from './full-screen/full-screen.component';

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
    FullScreenComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
  ]
})
export class MainModule { }
