import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CookieModule } from 'cookie';
import { LoggerModule } from 'logger';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { LoggerComponent } from './logger/logger.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'logger',
    component: LoggerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [LoggerComponent]
})
export class AppRoutingModule { }

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    CookieModule.forRoot(),
    LoggerModule.forRoot()
  ]
})
export class MainModule { }
