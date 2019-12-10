import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenService } from './fullscreen.service';
import {
  FULLSCREEN_REQUEST_EVENTS,
  FULLSCREEN_EXIT_EVENTS,
  FULLSCREEN_CHANGE_EVENTS,
  FULLSCREEN_ERROR_EVENTS,
  FULLSCREEN_ELEMENT_KEYS,
  FULLSCREEN_ENABLED_FUNCTION,
  FULLSCREEN_IOS_POLL_MS,
  FULLSCREEN_IOS_POLL_ENABLED,
  FULLSCREEN_ENABLED
} from './fullscreen.token';
import {
  DEFAULT_FULLSCREEN_REQUEST_EVENTS,
  DEFAULT_FULLSCREEN_EXIT_EVENTS,
  DEFAULT_FULLSCREEN_CHANGE_EVENTS,
  DEFAULT_FULLSCREEN_ERROR_EVENTS,
  DEFAULT_FULLSCREEN_ELEMENT,
  DEFAULT_FULLSCREEN_ENABLED_FUNCTION,
  DEFAULT_FULLSCREEN_IOS_POLL_MS,
  DEFAULT_FULLSCREEN_IOS_POLL_ENABLED,
  DEFAULT_FULLSCREEN_ENABLED
} from './fullscreen.token.defaults';

export interface FullscreenCommonModuleConfig {
  readonly ios: Partial<FullscreenCommonModuleIosPollingConfig>;
}

export interface FullscreenCommonModuleIosPollingConfig {
  readonly enabled: boolean;
  readonly pollDurationMs: number;
}

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule],
  providers: [
    FullscreenService,
    { provide: FULLSCREEN_REQUEST_EVENTS, useValue: DEFAULT_FULLSCREEN_REQUEST_EVENTS },
    { provide: FULLSCREEN_EXIT_EVENTS, useValue: DEFAULT_FULLSCREEN_EXIT_EVENTS },
    { provide: FULLSCREEN_CHANGE_EVENTS, useValue: DEFAULT_FULLSCREEN_CHANGE_EVENTS },
    { provide: FULLSCREEN_ERROR_EVENTS, useValue: DEFAULT_FULLSCREEN_ERROR_EVENTS },
    { provide: FULLSCREEN_ELEMENT_KEYS, useValue: DEFAULT_FULLSCREEN_ELEMENT },
    { provide: FULLSCREEN_ENABLED, useValue: DEFAULT_FULLSCREEN_ENABLED },
    { provide: FULLSCREEN_ENABLED_FUNCTION, useFactory: DEFAULT_FULLSCREEN_ENABLED_FUNCTION },
    { provide: FULLSCREEN_IOS_POLL_MS, useValue: DEFAULT_FULLSCREEN_IOS_POLL_MS },
    { provide: FULLSCREEN_IOS_POLL_ENABLED, useValue: DEFAULT_FULLSCREEN_IOS_POLL_ENABLED }
  ]
})
export class FullscreenCommonModule {
  static config(config: Partial<FullscreenCommonModuleConfig>): ModuleWithProviders {
    return {
      ngModule: FullscreenCommonModule,
      providers: [
        {
          provide: FULLSCREEN_IOS_POLL_ENABLED,
          useValue: config.ios && typeof config.ios.enabled === 'boolean' ? config.ios.enabled : DEFAULT_FULLSCREEN_IOS_POLL_ENABLED
        },
        {
          provide: FULLSCREEN_IOS_POLL_MS,
          useValue: config.ios && typeof config.ios.enabled === 'number'
            ? config.ios.pollDurationMs
            : DEFAULT_FULLSCREEN_IOS_POLL_MS
        }
      ]
    };
  }
}
