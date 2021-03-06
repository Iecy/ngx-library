import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'shared/shared.module';

import { MainComponent } from './main/main.component';

import { WaterMarkerModule } from 'water-marker';

import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    WaterMarkerModule
  ]
})
export class HomeModule { }
