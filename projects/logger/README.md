
# ngx-logger-icy
> angular4+以上的版本可以使用；继承console上的方法，可以根据环境变量控制log是否输出，解决开发环境需要打印一些log日志但是生产环境并不需要
## 1、开始使用
  - <a href="#install">安装</a>
  - <a href="#use">使用</a>
## 2、LoggerService中的方法
  - <a href="#log">log()</a>
  - <a href="#info">info()</a>
  - <a href="#debug">debug()</a>
  - <a href="#error">error()</a>
  - <a href="#warn">warn()</a>
  - <a href="#assert">assert()</a>
  - <a href="#clear">clear()</a>
  - <a href="#count">count()</a>
  - <a href="#group">group()</a>
  - <a href="#groupCollapsed">groupCollapsed()</a>
  - <a href="#groupEnd">groupEnd()</a>
  - <a href="#table">table()</a>
  - <a href="#time">time()</a>
  - <a href="#timeEnd">timeEnd()</a>
  - <a href="#trace">trace()</a> 
  - <a href="#profile">profile()</a>

## <a name="install">安装</a>

```
npm i ngx-logger-icy
```

## <a name="use">使用</a>

``LoggerModule``应该在``AppModule``中使用``forRoot()``静态方法注册，在子模块中使用``forChild()``注册。这些方法也接受``enable``对象。将其保留为默认值为空是``true``。

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LoggerModule } from 'ngx-logger-icy';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CookieModule.forRoot(),
    LoggerModule.forRoot(environment.enableConsole),// forRoot()如果为空,默认值为true
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```javascript
import { Component } from '@angular/core';
import { LoggerService } from 'ngx-logger-icy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(
    private _logger: LoggerService
  ) {
    this._logger.log('%c这就输出了。', 'color: green');
    this._logger.debug();
    this._logger.error('我是错误的输出。');
  }
}
```

## <a name="log">log()</a>
```javascript
/**
 * 输出信息
 * @description 同console.log()
 */
log(): Function;
```

## <a name="info">info()</a>
```javascript
/**
 * log别名，输出信息
 * @description 同console.info()
 */
info(): Function;
```

## <a name="debug">debug()</a>
```javascript
/**
 * @description 同console.debug()
 */
debug(): Function;
```

## <a name="error">error()</a>
```javascript
/**
 * 输出信息时，在最前面加一个红色的叉，表示出错，同时会显示错误发生的堆栈。
 * @description 同console.error()
 */
error(): Function;
```

## <a name="warn">warn()</a>
```javascript
/**
 * 输出警告信息
 * @description 同console.warn()
 */
warn(): Function;
```

## <a name="assert">assert()</a>
```javascript
/**
 * @param boolean
 * @param string
 * @description 同console.assert(); 接受两个参数，只有当第一个参数为false，才会输出第二个参数，否则不输出任何东西
 */
assert(): Function;
```

## <a name="clear">clear()</a>
```javascript
/**
 * 清除当前控制台的所有输出，将光标回置到第一行
 * @description 同console.clear()；此方法不分环境
 */
clear(): Function;
```

## <a name="count">count()</a>
```javascript
/**
 * 用于计数，输出它被调用了多少次。
 * @description 同console.count()
 */
count(): Function;
```

## <a name="group">group()</a>
```javascript
/**
 * 用于将显示的信息分组，可以把信息进行折叠和展开。
 * @description 同console.group()
 */
group(): Function;
```

## <a name="groupCollapsed">groupCollapsed()</a>
```javascript
/**
 * 与group方法很类似，唯一的区别是该组的内容，在第一次显示时是收起的（collapsed），而不是展开的
 * @description 同console.groupCollapsed()
 */
groupCollapsed(): Function;
```

## <a name="groupEnd">groupEnd()</a>
```javascript
/**
 * 结束内联分组
 * @description 同console.groupEnd()
 */
groupEnd(): Function;
```

## <a name="table">table()</a>
```javascript
/**
 * 将复合类型的数据转为表格显示
 * @description 同console.table()
 */
table(): Function;
```

## <a name="time">time()</a>
```javascript
/**
 * 计时开始
 * @description 同console.time()
 */
time(): Function;
```

## <a name="timeEnd">timeEnd()</a>
```javascript
/**
 * 计时结束
 * @description 同console.timeEnd()
 */
timeEnd(): Function;
```

## <a name="trace">trace()</a>
```javascript
/**
 * 追踪函数的调用过程
 * @description 同console.trace()
 */
trace(): Function;
```

## <a name="profile">profile()</a>
```javascript
/**
 * 性能分析器
 * @description 同console.profile()
 */
profile(): Function;
```