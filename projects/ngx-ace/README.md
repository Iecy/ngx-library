# angular ace编辑器

基于angular7、ace-builds构建的ace编辑器组件。[demo地址](https://ngx-library.now.sh/tools/ace)

## 开始使用

- [安装](#install)
- [使用](#use)
- [API](#api)

## <a name="install">安装</a>

```bash
npm i ngx-ace-icy
```

## <a name="use">使用</a>

安装成功后需要在项目中引入对应的`ace`的模式、主题文件。比如：需要的时`sql`语言：

### 修改`angular.json`文件

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "ace-test": {
      ...
      "architect": {
        "builder": {
          ....
          
            "scripts": [
              "./node_modules/ace-builds/src-min/ace.js",  // ace 核心文件
              "./node_modules/ace-builds/src-min/mode-sql.js", // sql 模式文件
              "./node_modules/ace-builds/src-min/snippets/sql.js",  // sql 模式部分文件
              "./node_modules/ace-builds/src-min/theme-monokai.js" // 主题样式文件
            ]
        }
      }
    }
  }
}
```

### 项目引入

`NgxAceModule`应该在`AppModule`中使用或通用的`module`模块中便于任何模块方便使用。

```typescript
/**
 * 以AppModule引入为例
 */
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { NgxAceModule } from 'ngx-ace-icy'; // 引入

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxAceModule, // 导入模块
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```



```typescript
/**
 * AppComponent
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
	// 普通使用方式
	<c-ngx-ace
  [options]="aclOptions"
  [text]="aceText"
  (textChange)="textChange($event)"
  ></c-ngx-ace>
	// ngModel 使用
	<c-ngx-ace
  [options]="aclOptions"
  [(ngModel)]="aceText"
  (ngModelChange)="textChange($event)"
  ></c-ngx-ace>
	`
})
export class AppComponent implements OnInit {
  /** ace 配置 **/
  public aclOptions = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showGutter: false,
    maxLines: 3,
    minLines: 4,
    autoScrollEditorIntoView: false,
  };
	/** ace 内容 **/
  public aceText = '';
  constructor() { }

  ngOnInit() {
  }
	/** ace 内容更改的回调函数 */
  public textChange(value): void {
    console.log(value);
  }
}
```


### <a name="api"> Api说明</a>

| 名称              | 说明                                                         | 类型                   |  必填   |    默认值    |
| :---------------- | :----------------------------------------------------------- | :--------------------- | :-----: | :----------: |
| `[options]`       | `ace`的配置信息.具体参考<a href="https://ace.c9.io/#nav=api&api=editor">ace api</a> | `object`               | `false` |     `-`      |
| `[placeholder]`   | 为空时的内容提示信息                                         | `string`               | `false` | `请输入内容` |
| `[style]`         | 样式                                                         | `object`               | `false` |     `-`      |
| `[readOnly]`      | 是否为只读                                                   | `boolean`              | `false` |   `false`    |
| `[theme]`         | 使用主题，ace官网主题，也可自行开发主题。                    | `string`               | `fasle` |  `monokai`   |
| `[mode]`          | 语言模式，ace官方模式，也可以自行开发。                      | `string`               | `false` |    `sql`     |
| `[(text)]`        | 文本内容，可进行双向 绑定。非`form`表单模式下可以使用。      | `string`               | `false` |     `-`      |
| `(textChange)`    | `text`文本更改后的回调。                                     | `EventEmitter<string>` | `false` |     `-`      |
| `[(ngModel)]`     | `angular`表单属性。与`[(text)]`互斥                          | `string`               | `false` |     `-`      |
| `[ngModelChange]` | `ngModel`内容更改后的回调                                    | `EventEmitter<string>` | `false` |     `-`      |



