import { Injectable } from '@angular/core';
import { CookieOptionsProvider } from './cookie-options-provider';
import { CookieOptions } from './cookie-options.model';
import { isBlank, isString, mergeOptions, safeDecodeURIComponent, safeJsonParse } from './utils';

declare interface Document {
  cookie: string;
}
declare const document: Document;

export interface ICookieService {
  /**
   * 获取指定cookie
   * @param key cookie的名称
   */
  get(key: string): string;
  /**
   * 获取指定cookie;cookie的值非字符，而是一个对象
   * @param key cookie的名称
   */
  getObject(key: string): object;
  /**
   * 获取所有的cookie
   */
  getAll(): object;
  /**
   * 设置cookie
   * @param key cookie的名称
   * @param value cookie的值
   * @param options 其他参数
   */
  set(key: string, value: string, options?: CookieOptions): void;
  /**
   * 设置cookie, cookie 的value是一个对象
   * @param key cookie的名称
   * @param value cookie的值
   * @param options 其他参数
   */
  setObject(key: string, value: object, options?: CookieOptions): void;
  /**
   * 删除指定key的 cookie
   * @param key cookie的名称
   * @param options 其他参数
   */
  remove(key: string, options?: CookieOptions): void;
  /**
   * 删除所有cookie
   * @param options 其他参数
   */
  removeAll(options?: CookieOptions): void;
}

@Injectable()
export class CookieService {
  protected options: CookieOptions;

  protected get cookieString(): string {
    return document.cookie || '';
  }

  protected set cookieString(value: string) {
    document.cookie = value;
  }

  constructor(protected _optionsProvider: CookieOptionsProvider) {
    this.options = this._optionsProvider.options;
  }

  public get(key: string): string {
    return this._cookieReader()[key];
  }

  public getObject(key: string): object {
    const value = this.get(key);
    return value ? safeJsonParse(value) : value;
  }

  public getAll(): object {
    return this._cookieReader();
  }

  public set(key: string, value: string, options?: CookieOptions): void {
    this._cookieWriter(key, value, options);
  }

  public setObject(key: string, value: object, options?: CookieOptions): void {
    this.set(key, JSON.stringify(value), options);
  }

  public remove(key: string, options?: CookieOptions): void {
    this.set(key, null, options);
  }

  public removeAll(options: CookieOptions): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(item => {
      this.remove(item, options);
    });
  }

  private _cookieReader(): object {
    let lastCookies = {};
    let lastCookieString = '';
    let cookieArray: string[];
    let name: string;
    const currentCookieString = this.cookieString;
    if (lastCookieString !== currentCookieString) {
      lastCookieString = currentCookieString;
      cookieArray = lastCookieString.split('; ');
      lastCookies = {};
      cookieArray.forEach(item => {
        const cookie = item;
        const index = cookie.indexOf('=');
        if (index > 0) { // 过滤掉名称为空的cookie
          name = safeDecodeURIComponent(cookie.substring(0, index));
          if (isBlank(lastCookies[name])) {
            lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
          }
        }
      });
    }
    return lastCookies;
  }

  private _cookieWriter(name: string, value: string, options: CookieOptions) {
    const cookieString = () => {
      const opts = mergeOptions(this.options, options);
      let expires = opts.expires;
      if (isBlank(value)) {
        value = '';
        expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      }
      if (isString(expires)) {
        expires = new Date(expires);
      }
      const cookieValue = opts.storeUnencoded ? value : encodeURIComponent(value);
      let str = encodeURIComponent(name) + '=' + cookieValue;
      str += opts.path ? ';path=' + opts.path : '';
      str += opts.domain ? ';domain=' + opts.domain : '';
      str += expires ? ';expires=' + expires.toUTCString() : '';
      str += opts.secure ? ';secure' : '';
      str += opts.httpOnly ? '; HttpOnly' : '';
      const cookieLength = str.length + 1;
      if (cookieLength > 4096) {
        console.log(`Cookie \'${name}\' possibly not set or overflowed because it was too large (${cookieLength} > 4096 bytes)!`);
      }
      return str;
    };
    this.cookieString = cookieString();
  }
}
