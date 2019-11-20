import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectorDirective } from './selector/selector.directive';

import { EditorComponent } from './editor.component';
import { EditorToolbarComponent } from './editor-toolbar.component';
import { SelectorComponent } from './selector/selector.component';

@NgModule({
  declarations: [
    SelectorDirective,

    EditorComponent,
    EditorToolbarComponent,
    SelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EditorComponent,
    EditorToolbarComponent
  ]
})
export class EditorModule { }
