# ngx-cookie-icy
> angular4+以上的版本可以使用；

## 1、开始使用
  - <a href="#install">安装</a>
  - <a href="#use">使用</a>
## 2、cookieService中的方法
  - <a href="#get">get()</a>
  - <a href="#getObject">getObject()</a>
  - <a href="#getAll">getAll()</a>
  - <a href="#set">set()</a>
  - <a href="#setObject">setObject()</a>
  - <a href="#remove">remove()</a>
  - <a href="#removeAll">removeAll()</a>

## <a name="install">安装</a>

```
npm install ngx-cookie-icy
```

## <a name="use">使用</a>

``CookieModule``应该在``AppModule``中使用``forRoot()``静态方法注册，在子模块中使用``forChild()``注册。这些方法也接受``CookieOptions``对象。将其保留为默认值为空。

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CookieModule } from 'ngx-cookie-icy';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CookieModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```javascript
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-icy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(
    private _cookieService: CookieService
  ) {
    this._cookieService.set('paopao', '看好你哦');
  }
}
```

## <a name="get">get()</a>
```javascript
/**
 * 获取指定cookie
 * @param key cookie的名称
 */
get(key: string): string;
```

## <a name="getObject">getObject()</a>
```javascript
/**
 * 获取指定cookie;cookie的值非字符，而是一个对象
 * @param key cookie的名称
 */
getObject(key: string): object;
```

## <a name="getAll">getAll()</a>
```javascript
/**
 * 获取所有的cookie
 */
getAll(): object;
```

## <a name="set">set()</a>
```javascript
/**
 * 设置cookie
 * @param key cookie的名称
 * @param value cookie的值
 * @param options 其他参数
 */
set(key: string, value: string, options?: CookieOptions): void;
```

## <a name="setObject">setObject()</a>
```javascript
/**
 * 设置cookie, cookie 的value是一个对象
 * @param key cookie的名称
 * @param value cookie的值
 * @param options 其他参数
 */
setObject(key: string, value: object, options?: CookieOptions): void;
```

## <a name="remove">remove()</a>
```javascript
/**
 * 删除指定key的 cookie
 * @param key cookie的名称
 * @param options 其他参数
 */
remove(key: string, options?: CookieOptions): void;
```

## <a name="removeAll">removeAll()</a>
```javascript
/**
 * 删除所有cookie
 * @param options 其他参数
 */
removeAll(options?: CookieOptions): void;
```
