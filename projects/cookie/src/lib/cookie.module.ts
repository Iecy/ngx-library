import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CookieService } from './cookie.service';
import { CookieOptions } from './cookie-options.model';
import { cookieServiceFactory } from './cookie.factory';
import { COOKIE_OPTIONS, CookieOptionsProvider } from './cookie-options-provider';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [],
  providers: [CookieOptionsProvider]
})
export class CookieModule {
  static forRoot(options: CookieOptions = {}): ModuleWithProviders {
    return {
      ngModule: CookieModule,
      providers: [
        { provide: COOKIE_OPTIONS, useValue: options },
        { provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider] }
      ]
    };
  }

  static forChild(options: CookieOptions = {}): ModuleWithProviders {
    return {
      ngModule: CookieModule,
      providers: [
        { provide: COOKIE_OPTIONS, useValue: options },
        { provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider] }
      ]
    };
  }
}
