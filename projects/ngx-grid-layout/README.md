# NgxGridLayout

ngx-grid-layout是一个类似于[Gridster](http://dsmorse.github.io/gridster.js/)适用于angular7.X之上。

## 开始使用

- <a herf="#install">安装</a>
- <a href="#use">使用</a>

### 内部类型定义

```typescript
export interface ILayout {
  x: number;
  y: number;
  w: number;
  h: number;
  i: any;
  minW?: number,
  minH?: number,
  maxW?: number,
  maxH?: number,
  moved?: boolean,
  isDraggable?: boolean,
  isResizable?: boolean
  static?: boolean;
}
  
export interface ILayoutCols {
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  xxs?: number;
}
```



## <a name="install">安装</a>

```shell
npm i c-ngx-grid-layout
```

## <a name="use">使用</a>

`NgxGridLayoutModule`应用在`SharedModule`中；

> app.module.ts

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

> SharedModule.ts

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxGridLayoutModule } from 'ngx-grid-layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxGridLayoutModule,
  ],
  exports: [
    NgZorroAntdModule,
    NgxGridLayoutModule,
  ]
})
export class SharedModule { }
```

### 开始使用

> grid-layout.component.ts

```typescript
import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

const testLayout = [
  { "x": 0, "y": 0, "w": 2, "h": 2, "i": "0", minW: 3, resizable: false, draggable: false, static: false },
  { "x": 2, "y": 0, "w": 2, "h": 4, "i": "1", resizable: false, draggable: false, static: false },
  { "x": 4, "y": 0, "w": 2, "h": 5, "i": "2", resizable: false, draggable: false, static: false },
  { "x": 6, "y": 0, "w": 2, "h": 3, "i": "3", resizable: false, draggable: false, static: false },
  { "x": 8, "y": 0, "w": 2, "h": 3, "i": "4", resizable: false, draggable: false, static: false },
  { "x": 10, "y": 0, "w": 2, "h": 3, "i": "5", resizable: false, draggable: false, static: false },
  { "x": 0, "y": 5, "w": 2, "h": 5, "i": "6", resizable: false, draggable: false, static: false },
  { "x": 2, "y": 5, "w": 2, "h": 5, "i": "7", resizable: false, draggable: false, static: false },
  { "x": 4, "y": 5, "w": 2, "h": 5, "i": "8", resizable: false, draggable: false, static: false },
  { "x": 6, "y": 3, "w": 2, "h": 4, "i": "9", resizable: false, draggable: false, static: true },
  { "x": 8, "y": 4, "w": 2, "h": 4, "i": "10", resizable: false, draggable: false, static: false },
  { "x": 10, "y": 4, "w": 2, "h": 4, "i": "11", resizable: false, draggable: false, static: false },
  { "x": 0, "y": 10, "w": 2, "h": 5, "i": "12", resizable: false, draggable: false, static: false },
  { "x": 2, "y": 10, "w": 2, "h": 5, "i": "13", resizable: false, draggable: false, static: false },
  { "x": 4, "y": 8, "w": 2, "h": 4, "i": "14", resizable: false, draggable: false, static: false },
  { "x": 6, "y": 8, "w": 2, "h": 4, "i": "15", resizable: false, draggable: false, static: false },
  { "x": 8, "y": 10, "w": 2, "h": 5, "i": "16", resizable: false, draggable: false, static: false },
  { "x": 10, "y": 4, "w": 2, "h": 2, "i": "17", resizable: false, draggable: false, static: false },
  { "x": 0, "y": 9, "w": 2, "h": 3, "i": "18", resizable: false, draggable: false, static: false },
  { "x": 2, "y": 6, "w": 2, "h": 2, "i": "19", resizable: false, draggable: false, static: false }
];

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  style: `
    ngx-grid-item {
    background: #ccc;
    border    : 1px solid black;
    text-align: center;
    }
    ngx-grid-layout {
    background-color: #fff;
    }

    .layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
    }

    .columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
    }

    :host ::ng-deep .ngx-grid-static {
    background-color: #cce;
    }
	`
})
export class GridLayoutComponent implements OnInit {
  @ViewChild('content') public contentEl: ElementRef;
  public layout = JSON.parse(JSON.stringify(testLayout));
  public index: number = 0;
  public draggable = true;
  public resizable = true;
  public mirrored = false;
  public responsive = true;
  public preventCollision = false;
  public rowHeight = 30;
  public colNum = 12;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.index = this.layout.length;
    console.log(this.layout, 'this is demo init layout');
  }

  layoutChanged(layout: any): void {
    console.log('LAYOUT CHANGED:', layout);
  }

  layoutReady(layout: any): void {
    console.log('LAYOUT READY: ', layout);
  }

  containerResized(layoutItem: any): void {
    console.log('CONTAINER RESIZED:', layoutItem);
  }

  public decreaseWidth(): void {
    const conentHtml: HTMLElement = this.contentEl.nativeElement;
    let width = conentHtml.offsetWidth;
    width -= 20;
    this.renderer.setStyle(this.contentEl.nativeElement, 'width', `${width}px`);
  }

  public increaseWidth(): void {
    const conentHtml: HTMLElement = this.contentEl.nativeElement;
    let width = conentHtml.offsetWidth;
    width += 20;
    this.renderer.setStyle(this.contentEl.nativeElement, 'width', `${width}px`);
  }

  public addItem(): void {
    const item = { "x": 0, "y": 0, "w": 2, "h": 2, "i": this.index + "", whatever: "bbb" };
    this.index++;
    this.layout = [...this.layout, item];
  }
  
  trackByFn(index) { return index }
}

```

> grid-layout.compnent.html

```html
<div #content>
  <ngx-grid-layout
    [(layout)]="layout"
    [colNum]="colNum"
    [rowHeight]="rowHeight"
    [isDraggable]="draggable"
    [isResizable]="resizable"
    [isMirrored]="mirrored"
    [preventCollision]="preventCollision"
    [verticalCompact]="true"
    [useCssTransforms]="true"
    [responsive]="responsive"
    (layoutChanged)="layoutChanged($event)"
    (layoutReady)="layoutReady($event)"
  >
    <ngx-grid-item 
      *ngFor="let item of layout; trackBy: trackByFn"
      [static]="item.static"
      [x]="item.x"
      [y]="item.y"
      [h]="item.h"
      [w]="item.w"
      [i]="item.i"
      [minW]="item.minW"
    >
      <div class="ngx-grid-item-draggable--box">
        {{item.i}}
      </div>
    </ngx-grid-item>
  </ngx-grid-layout>
</div>
```

## `ngx-grid-layout` API

| name                 | DESCRIPTION                                                  | TYPE                      | DEFAULT    | REQUIRED |
| -------------------- | ------------------------------------------------------------ | ------------------------- | ---------- | -------- |
| `[(layout)]`         | 数据源；                                                     | `ILayout[]`               | `-`        | `true`   |
| `[colNum]`           | 定义栅格系统的列数，其值需为自然如                           | `number`                  | `12`       | `false`  |
| `[rowHeight]`        | 每行的高度，单位像素                                         | `number`                  | `150`      | `false`  |
| `[margin]`           | 定义栅格中的元素边距；数组中的一个元素表示水平边距，第二个表示垂直边距，单位为`像素` | `number[]`                | `[10, 10]` | `false`  |
| `[isDraggable]`      | 标识栅格中的元素是否可以拖拽。                               | `boolean`                 | `true`     | `false`  |
| `[isResizable]`      | 标识栅格中的元素是否可以调整大小。                           | `boolean`                 | `true`     | `false`  |
| `[isMirrored]`       | 标识栅格中的元素是否可镜像反转。                             | `boolean`                 | `false`    | `false`  |
| `[autoSize]`         | 标识容器是否自动调整大小。                                   | `boolean`                 | `true`     | `false`  |
| `[verticalCompact]`  | 标识布局是否垂直压缩。                                       | `boolean`                 | `true`     | `false`  |
| `[useCssTransforms]` | 标识是否使用css属性`transition-property: transform`          | `boolean`                 | `true`     | `false`  |
| `[responsive]`       | 标识布局是否为响应式。                                       | `boolean`                 | `false`    | `false`  |
| `(layoutReady)`      | layout最近加载完成                                           | `EventEmitter<ILayout[]>` | `-`        | `false`  |
| `(layoutChanged)`    | layout数据有所改变的回调函数。                               | `EventEmitter<ILayout[]>` | `-`        | `false`  |


## `ngx-grid-item` API

| NAME                 | DESCRIPTION                                                  | TYPE                                          | DEFAULT    | REQUIRED |
| -------------------- | ------------------------------------------------------------ | --------------------------------------------- | ---------- | -------- |
| `[i]`                | 栅格中元素的ID                                               | `string`                                      | `-`        | `true`   |
| `[x]`                | 标识栅格元素位于第几列，需为自然数。                         | `number`                                      | `-`        | `true`   |
| `[y]`                | 标识栅格元素位于第几行，需为自然数                           | `number`                                      | `-`        | `true`   |
| `[w]`                | 标识栅格元素的初始宽度，值为`colWidth`的倍数。               | `number`                                      | `-`        | `true`   |
| `[h]`                | 标识栅格元素的初始高度，值为`rowHeight`的倍数。              | `number`                                      | `-`        | `true`   |
| `[minW]`             | 栅格元素的最小宽度，值为`colWidth`的倍数。如果`w`小于`minW`,则`minW`的值会被`w`覆盖。 | `number`                                      | `1`        | `false`  |
| `[minH]`             | 格栅元素的最小高度，值为`rowHeight`的倍数。如果`h`小于`minH`,则`minH`的值会被`h`覆盖。 | `number`                                      | `1`        | `false`  |
| `[maxW]`             | 栅格元素的最大宽度，值为`colWidth`的倍数。如果`w`大于`maxW`，则`maxW`的值会被`w`覆盖 | `number`                                      | `Infinity` | `false`  |
| `[maxH]`             | 栅格元素的最大高度，值为`rowHeight`的倍数。如果`h`大于`maxH`，则`maxH`的值会被`h`覆盖。 | `number`                                      | `Infinity` | `false`  |
| `[isDraggable]`      | 标识栅格元素是否可拖拽。如果值为`null`则取决于父容器。       | `boolean`                                     | `null`     | `false`  |
| `[isResizable]`      | 标识栅格元素是否可调整大小。如果值为`null`则取决于父容器。   | `boolean`                                     | `null`     | `false`  |
| `[static]`           | 标识栅格元素是否为静态的（无法拖拽、调整大小或被其他元素移动）。 | `boolean`                                     | `false`    | `false`  |
| `[dragIgnoreFrom]`   | 标识栅格元素中哪些子元素无法触发拖拽事件，值为`css-like`选择器。请参考 [interact.js docs](http://interactjs.io/docs/#ignorable-selectors)中的`ignoreFrom`。 | `string`                                      | `a,button` | `false`  |
| `[dragAllowFrom]`    | 标识栅格元素中哪些子元素可以触发拖拽事件，值为`css-like`选择器。如果值为`null`则表示所有子元素（`dragIgnoreFrom`的除外）。请参考 [interact.js docs](http://interactjs.io/docs/#ignorable-selectors)中的`allowFrom`。 | `string`                                      | `null`     | `false`  |
| `[resizeIgnoreFrom]` | 标识栅格元素中哪些子元素无法触发调整大小的事件，值为`css-like`选择器。请参考 [interact.js docs](http://interactjs.io/docs/#ignorable-selectors)中的`ignoreFrom`。 | `string`                                      | `a,button` | `false`  |
| `(move)`             | 移动过程中的回调函数                                         | `EventEmitter<{i: string;x:number;y:number}>` | `-`        | `false`  |
| `(moved)`            | 移动完成的回调                                               | `EventEmitter<{i: string;x:number;y:number}>` | `-`        | `false`  |
| `(resize)`           | 放大的过程的回调函数                                         | `EventEmitter<{i: string;x:number;y:number}>` | `-`        | `false`  |
| `(resized)`          | 放大完成的回调函数                                           | `EventEmitter<{i: string;x:number;y:number}>` | `-`        | `false`  |

