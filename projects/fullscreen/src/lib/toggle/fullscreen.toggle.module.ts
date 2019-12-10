import { NgModule } from '@angular/core';
import { FullscreenEnterDirective, FullscreenExitDirective } from './fullscreen.toggle.directive';

@NgModule({
  imports: [],
  exports: [
    FullscreenEnterDirective,
    FullscreenExitDirective
  ],
  declarations: [
    FullscreenEnterDirective,
    FullscreenExitDirective
  ]
})
export class FullscreenToggleModule { }
