import { NgModule } from '@angular/core';
import { FullscreenOffDirective, FullscreenOnDirective } from './fullscreen.switch.directive';
import { FullscreenCommonModule } from 'fullscreen/common/fullscreen-common.module';

@NgModule({
  imports: [ FullscreenCommonModule],
  declarations: [
    FullscreenOffDirective,
    FullscreenOnDirective,
  ],
  exports: [
    FullscreenOnDirective,
    FullscreenOffDirective,
  ]
})
export class FullscreenSwitchModule {}
