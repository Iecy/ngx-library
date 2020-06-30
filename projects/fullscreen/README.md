# Fullscreen
>angular7+以上的版本可以使用；[demo地址](https://ngx-library.now.sh/tools/full-screen)

## 安装
```
npm i ngx-fullscreen-icy --save
```

```typescript
import { NgModule } from '@angular/core';
import { FullscreenModule } from 'ngx-fullscreen-icy';
@NgModule({
  imports: [
    FullscreenModule
  ]
})
export class AppModule { }
```

## 使用
- `cFullscreenEnter`监听指定元素点击事件，展开全屏效果。
- `cFullscreenExit`监听当前元素的点击事件，取消全屏效果。
- `*cIfFullscreen` 在全屏模式显示当前元素。
- `*cIfNotFullscreen` 在非全屏模式显示当前元素。

```html
<div class="container" #takeMeFullscreen>
  <h3>全屏效果</h3>
  <h4>这个区域是全屏区域</h4>
  <button *cIfFullscreen cFullscreenExit>退出全屏</button>
  <button *cIfNotFullscreen [cFullscreenEnter]="takeMeFullscreen">全屏</button>
</div>
<div class="container" #takeMeFullscreen2>
  <div>
    <video src="https://www.w3school.com.cn/i/movie.ogg" controls="controls">
      your browser does not support the video tag
    </video>
  </div>
  <button *cIfFullscreen cFullscreenExit>退出全屏</button>
  <button *cIfNotFullscreen [cFullscreenEnter]="takeMeFullscreen2">全屏</button>
</div>
```

<img src="./review.gif" width="100%">