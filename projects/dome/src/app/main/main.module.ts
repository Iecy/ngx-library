import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CookieModule } from 'cookie';
import { LoggerModule } from 'logger';
import {NgZorroAntdModule} from 'ant-reset-private';
import { SharedModule } from 'shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { LoggerComponent } from './logger/logger.component';
import { FormsModule } from '@angular/forms';

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
    LoggerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    CookieModule.forRoot(),
    LoggerModule.forRoot()
  ]
})
export class MainModule { }
