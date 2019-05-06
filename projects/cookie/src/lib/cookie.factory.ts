import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';

export function cookieServiceFactory(cookieServiceProvider: CookieOptionsProvider): CookieService {
  return new CookieService(cookieServiceProvider);
}
