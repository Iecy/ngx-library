import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MainComponent } from './main/main.component';
import { EditorModule } from 'editor/editor.module';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    AppRoutingModule,
  ]
})
export class HomeModule { }
