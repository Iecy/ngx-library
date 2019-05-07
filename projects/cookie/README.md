# ngx-cookie-icy
> angular4+以上的版本可以使用；

## 1、开始使用
  - <a href="#install">安装</a>
  - <a href="#use">使用</a>


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
