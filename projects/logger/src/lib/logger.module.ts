import { NgModule, ModuleWithProviders } from '@angular/core';

import { ENABLE_CONSOLE } from './logger.token';
import { loggerFactory } from './logger.factory';
import { LoggerService } from './logger.service';

@NgModule({
  imports: [
  ],
  exports: []
})
export class LoggerModule {
  static forRoot(enable: boolean): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        { provide: ENABLE_CONSOLE, useValue: enable },
        { provide: LoggerService, useFactory: loggerFactory, deps: [ENABLE_CONSOLE] }
      ]
    };
  }
  static forChild(enable: boolean): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        { provide: ENABLE_CONSOLE, useValue: enable },
        { provide: LoggerService, useFactory: loggerFactory, deps: [ENABLE_CONSOLE] }
      ]
    };
  }
}
