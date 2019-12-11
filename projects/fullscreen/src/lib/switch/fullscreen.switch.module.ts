import { NgModule } from '@angular/core';

import { FullscreenOffDirective, FullscreenOnDirective } from './fullscreen.switch.directive';
import { FullscreenCommonModule } from '../common/fullscreen.module';

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
