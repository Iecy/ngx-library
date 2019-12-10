import { NgModule } from '@angular/core';
import { FullscreenCommonModule } from './common/fullscreen-common.module';
import { FullscreenToggleModule } from './toggle/fullscreen.toggle.module';
import { FullscreenSwitchModule } from './switch/fullscreen.switch.module';

@NgModule({
  declarations: [],
  imports: [
    FullscreenCommonModule,
    FullscreenToggleModule,
    FullscreenSwitchModule,
  ],
  exports: [
    FullscreenCommonModule,
    FullscreenToggleModule,
    FullscreenSwitchModule,
  ]
})
export class FullscreenModule { }
