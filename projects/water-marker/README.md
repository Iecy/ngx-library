# ngx-water-marker
> angular7+ 水印背景[demo地址](https://ngx-library.now.sh/water-marker/main)
## 1、开始使用
  - <a href="#install">安装</a>
  - <a href="#use">使用</a>

## <a name="install">安装</a>

```
npm i ngx-water-marker
```
## <a name="use">使用</a>
``WaterMarkerModule``需添加到使用的``module``的文件中。此处以``AppModule``为例：

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { WaterMarkerModule } from 'ngx-water-marker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WaterMarkerModule
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```javascript
import { Component } from '@angular/core';
import { WaterMarkerOption } from 'ngx-water-marker';

@Component({
  selector: 'app-root',
  template: `
    <div [cWaterMarker]="water"></div>
  `,
  style: [`
    div {
      height: 1000px;
    }
  `]
})
export class AppComponent {
  water: WaterMarkerOption = { text: '卢西奥', setting: { fontSize: 40 } };
}
```
