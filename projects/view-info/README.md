# view-info
> angular7+以上的版本可以使用


## 1、开始使用
  - <a href="#install">安装</a>
  - <a href="#use">使用</a>
  
## <a name="install">安装</a>

```
npm i view-info
```
## <a name="use">使用</a>
``ViewInfoModule``需添加到使用的``module``的文件中。此处以``AppModule``为例：

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ViewInfoModule } from 'view-info';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ViewInfoModule
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <c-view-info [viewInfoTemplate]="name"></c-view-info>

    <ng-template #name>
      <div>我是view-info</div>
    </ng-template>
  `,
  style: [`
    div {
      height: 1000px;
    }
  `]
})
export class AppComponent {}
```
