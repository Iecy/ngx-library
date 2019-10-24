# LayoutMenus
> 满足公司内部，菜单使用 ng 7.0+

## 1、开始使用
  - <a href="#install">安装</a>
  - <a href="#use">使用</a>

## 2、使用方式

为满足系统``上下``布局和``左右``布局，支持LOGO部分存在`c-layout-header` 及`c-layout-side` 组件内 

`cMenuList`结构参数

| name         | description       | type              | required |
| ------------ | ----------------- | ----------------- | -------- |
| `id`         | ID;组件内部无使用 | `number`          | `false`  |
| `attributes` | 菜单属性集合      | `json`            | `true`   |
| router       | 路由地址          | `null` | `string` | `ture`   |
| iconImage    | 路由图标          | `null` | `string` | `false`  |
| title        | 标题              | `stirng`          | `true`   |
| children     | 子级              | `Array`           | `false`  |

```json
[
    {
        id: 1,
        attributes: {
            router: '/home',
            iconImage: 'base64 img url',
            title: '首页'
            ...其他自定义属性
        }
    }, {
        id: 2,
        attributes: {
            router: null,
            iconImage: 'base64 img url',
            title: '淘淘'
            subMenu: true
        },
        children: [
            {
                id: 3,
                attributes: {
                    router: '/taotao/hao',
                    iconImage: 'base64 img url',
            		title: '淘淘好'
                }
            }
        ]
    }
]
```



### <a href="#header">头部导航</a>

- `c-layout-header`整个顶部导航使用

### <a href="#left">左侧导航</a>

- `c-layout-side`整体左侧组件使用
- `c-layout-side-router`左侧组件当个`item`使用

### <a href="#layout">整体布局</a>

在使用组件之前先布局结构（可以按自己的结构布局）

## <a name="install">安装</a>

```javascript
npm i layout-menus --save
```

## <a name="use">使用</a>

### 项目引入`LayoutMenusModule`

``LayoutMenusModule``应用在``SharedModule``中, 具体使用方式如下。因使用到``Ant Design``需要引入``HttpClientModule`` ``BrowserAnimationsModule``;

> app.module.ts
```javascript
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

> shared.module.ts
```javascript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LayoutMenusModule } from 'layout-menus';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    LayoutMenusModule,
  ],
  exports: [
    NgZorroAntdModule,
    LayoutMenusModule,
  ]
})
export class SharedModule { }
```

### <a name="header">头部导航</a>

#### 参数

| Name                 | Description                                                  | type                          | required | default |
| -------------------- | ------------------------------------------------------------ | ----------------------------- | -------- | ------- |
| `[cCollapsed]`       | 左侧菜单是否展开                                             | `boolean`                     | `false`  | `false` |
| `[cIsLogo]`          | 是否在头部展示`logo`部分                                     | `boolean`                     | `false`  | `false` |
| `[cMenuList]`        | 菜单列表，当为`true`是，`[cLogoRender]`和`[cLogoConfig]`生效 | `Array`                       | `true`   | `-`     |
| `[cLogoRender]`      | 自定义`logo`区域的内容,                                      | `TemplateRef<void>`           | `false`  | `-`     |
| `[cLogoConfig]`      | `logo`不使用自定义的结构。可使用参数传值                     | `json`                        |          |         |
| `[cMenuRight]`       | 右侧菜单                                                     | `template: TemplateRef<void>` | `false`  | `-`     |
| `(outsideMouseover)` | `logo`区域外部菜单`mouseover`事件                            | `EventEmitter<any>`           | `false`  | `-`     |
| `(clickMenu)`        | 点击菜单事件                                                 | `EventEmitter<menu>`          | `false`  | `-`     |

#### 精简头部菜单模式

```typescript
import { Component } from '@angular/core';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demo-layout-header-simple',
  template: `
    <c-layout-header [cMenuList]="menuList" [cCollapsed]="isCollapsed" [cLogoRender]="null"></c-layout-header>
  `,
})
export class DemoLayoutHeaderSimpleComponent {
  public isCollapsed = false;
  public menuList = [];
}
```

#### 显示右侧菜单。

由于右侧菜单可能拥有不同的`事件`或者`样式`，所以没有设置默认模板。但是拥有一套`统一`的样式，书写时带有正确的`class`即可；

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-header-right-menu',
  template: `
    <c-layout-header [cMenuList]="menuList" [cCollapsed]="isCollapsed" [cLogoRender]="null" [cMenuRight]="rightMenu"></c-layout-header>
    <ng-template #rightMenu>
      <span class="layout-header-container-action">二维码</span>
      <span class="layout-header-container-action">消息通知</span>
      <span class="layout-header-container-action">个人中心</span>
      <span class="layout-header-container-action layout-header-container-action--account">泡泡糖，你好<i nz-icon nzType="down" nzTheme="outline"></i></span>
    </ng-template>
  `
})
export class DemoLayoutHeaderRightMenuComponent {
  public isCollapsed = false;
  public menuList = [];
}
```

#### 显示左侧`logo`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-header-logo',
  template: `
    <c-layout-header [cMenuList]="menuList" [cCollapsed]="isCollapsed" [cIsLogo]="true" [cLogoConfig]="logoConfig" ></c-layout-header>
  `
})
export class DemoLayoutHeaderLogoComponent {
  public isCollapsed = false;
  public menuList = [];
  public logoConfig = {
    title: '权限管理',
    outsideIcon: 'menu',
    logoImg: '../assets/logo.png'
  };
}
```

### <a name="left">左侧导航</a>
#### 参数
| Name                 | Description                              | type                    | required | default |
| -------------------- | ---------------------------------------- | ----------------------- | -------- | ------- |
| `[cMenuList]`        | 菜单列表                                 | `Array`                 | `true`   | `-`     |
| `[cLogoConfig]`      | `logo`不使用自定义的结构。可使用参数传值 | `json`                  | `false`  | `-`     |
| `[cMenuTop]`         | 在菜单列表区域添加`自定义的顶部内容`     | `TemplateRef<void>`     | `false`  | `-`     |
| `[cMenuBottom]`      | 在菜单区域添加底部`自定义的内容`         | `TemplateRef<void>`     | `false`  | `-`     |
| `[cLogoRender]`      | 自定义`logo`区域的内容,                  | `TemplateRef<void>`     | `false`  | `-`     |
| `[cMenuItemRouter]`  | 自定义路由列表                           | `templateRef<void>`     | `false`  | `-`     |
| `[cCollapsed]`       | 当前收起状态                             | `boolean`               | `false`  | `false` |
| `(cCollapsedChange)` | 展开-收起时的回调函数                    | `EventEmitter<boolean>` | `false`  | `-`     |
| `(outsideMouseover)` | `logo`区域外部菜单`mouseover`事件        | `EventEmitter<any>`     | `false`  | `-`     |
| `(clickMenu)` | 点击左侧导航事件 | `EventEmitter<menu>` | `false` | `-` |

#### 简单使用
简单使用，只留有菜单部分；

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-side-simple',
  template: `
  <nz-sider nzCollapsible [(nzCollapsed)]="isCollapsed" [nzTrigger]="null" [nzCollapsedWidth]="isCollapsed ? 50 : 200">
    <c-layout-side [cMenuList]="menuList" [(cCollapsed)]="isCollapsed" [cLogoRender]="null"></c-layout-side>
  </nz-sider>
  `,
  styles: [`
  nz-sider {
    position: fixed;
    top: 0px;
    bottom: 0;
    box-shadow: 5px 0 4px -4px #ddd;
  }
  `]
})
export class DemoLayoutSideSimpleComponent {
  public isCollapsed = false;
  public menuList = [];
}
```

#### 带有logo模式

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-side-logo',
  template: `
  <nz-sider nzCollapsible [(nzCollapsed)]="isCollapsed" [nzTrigger]="null" [nzCollapsedWidth]="isCollapsed ? 50 : 200">
    <c-layout-side [cMenuList]="menuList" [(cCollapsed)]="isCollapsed" [cLogoConfig]="logoConfig"></c-layout-side>
  </nz-sider>
  `,
  styles: [`
  nz-sider {
    position: fixed;
    top: 0px;
    bottom: 0;
    box-shadow: 5px 0 4px -4px #ddd;
  }
  `]
})
export class DemoLayoutSideLogoComponent {
  public isCollapsed = false;
  public menuList = [];
  public logoConfig = {
    title: '权限管理',
    outsideIcon: 'menu',
    logoImg: '../assets/logo.png'
  };
}
```

#### 自定义LOGO区域

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-side-simple',
  template: `
  <nz-sider nzCollapsible [(nzCollapsed)]="isCollapsed" [nzTrigger]="null" [nzCollapsedWidth]="isCollapsed ? 50 : 200">
    <c-layout-side [cMenuList]="menuList" [(cCollapsed)]="isCollapsed" [cLogoRender]="LogoTemplate"></c-layout-side>
  </nz-sider>
  <ng-template #LogoTemplate>
    <a href="">
      <div class="global-app-menu-logo" [class.global-app-menu-logo--collapsed]="isCollapsed">
        <span class="global-app-menu-logo--title">我是头部的Logo</span>
      </div>
    </a>
  </ng-template>
  `,
  styles: [`
  nz-sider {
    position: fixed;
    top: 0px;
    bottom: 0;
    box-shadow: 5px 0 4px -4px #ddd;
  }
  `]
})
export class DemoLayoutHeaderRightMenuComponent {
  public isCollapsed = false;
  public menuList = [];
}
```

#### 自定义菜单列表`item`

```typescript
import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demo-layout-side-custom-menu-item-router',
  template: `
    <nz-sider nzCollapsible [(nzCollapsed)]="isCollapsed" [nzTrigger]="null" [nzCollapsedWidth]="isCollapsed ? 50 : 200">
    <c-layout-side
      [cMenuList]="menuList"
      [(cCollapsed)]="isCollapsed"
      [cLogoConfig]="logoConfig"
      [cMenuItemRouter]="menuItemTemplate"
      ></c-layout-side>
    </nz-sider>

    <ng-template #menuItemTemplate let-menu let-size="size">
      <ng-container *ngIf="menu.attributes.subMenu">
        <div
          nz-tooltip
          [nzTitle]="isCollapsed ? menu?.attributes?.title : ''"
          nzPlacement="right"
          class="menu-item"
          [routerLink]="menu.attributes.router"
          routerLinkActive
          #routerRef="routerLinkActive"
          [class.active]="routerRef.isActive && menu.attributes.router"
          [class.open]="menu.show"
        >
          <img [style.width.px]="size" [src]="sanitizer.bypassSecurityTrustUrl(menu.attributes.iconImage)">
            自定义属性subMenu
          <i class="menu-more" nz-icon nzType="right" nzTheme="outline" (click)="expandMore($event, menu)"></i>
        </div>
      </ng-container>

      <ng-container *ngIf="!menu.attributes.subMenu">
        <c-layout-side-router [menu]="menu" [cCollapsed]="isCollapsed" [imgSize]="size"></c-layout-side-router>
      </ng-container>
    </ng-template>
  `,
  styles: [`
  nz-sider {
    position: fixed;
    top: 0px;
    bottom: 0;
    box-shadow: 5px 0 4px -4px #ddd;
  }

  nz-content {
    margin: 0 16px;
  }

  c-layout-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transition: all .2s;
  }
  `]
})
export class DemoLayoutSideCustomMenuItemRouterComponent {
  public isCollapsed = false;
  public menuList = [
    ...
    {
      id: 104,
      attributes: {
        router: null,
        subMenu: true,
        // tslint:disable-next-line:max-line-length
        iconImage: '',
        icon: 'iconfont icon-guanli',
        title: '审批管理'
      },
      children: [
        {
          id: 106,
          attributes: {
            router: '/approval/authority-approval',
            iconImage: null,
            icon: 'authority-approval',
            title: '权限审批'
          },
          children: []
        }
      ]
    }
  ];
  logoConfig = {
    title: '权限管理',
    outsideIcon: 'menu',
    logoImg: '../assets/logo.png'
  };
}
```

#### 菜单列表增加自定义头部和底部

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-side-custom-top-and-bottom',
  template: `
  <nz-sider nzCollapsible [(nzCollapsed)]="isCollapsed" [nzTrigger]="null" [nzCollapsedWidth]="isCollapsed ? 50 : 200">
    <c-layout-side
      [cMenuList]="menuList"
      [(cCollapsed)]="isCollapsed"
      [cLogoConfig]="logoConfig"
      [cMenuTop]="menuTop"
      [cMenuBottom]="menuBottom"
    ></c-layout-side>
  </nz-sider>

  <ng-template #menuTop>
    <div *ngIf="!isCollapsed">菜单列表自定义顶部</div>
  </ng-template>

  <ng-template #menuBottom>
    <div *ngIf="!isCollapsed">菜单列表自定义顶部</div>
  </ng-template>
  `,
  styles: [`
  nz-sider {
    position: fixed;
    top: 0px;
    bottom: 0;
    box-shadow: 5px 0 4px -4px #ddd;
  }
  div {
    height: 64px;
    line-height: 64px;
    text-align: center;
    background: #e4e4e4;
  }
  `]
})
export class DemoLayoutSideCustomTopAndBottomComponent {
  public isCollapsed = false;
  public menuList = [];
}
```

### <a name="layout">整体结构</a>

#### logo在左侧布局

```typescript
import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demo-layout-logo-left',
  template: `
  <nz-layout>
    <nz-sider nzCollapsible [(nzCollapsed)]="isCollapsed" [nzTrigger]="null" [nzCollapsedWidth]="isCollapsed ? 50 : 200">
      <c-layout-side [cMenuList]="menuList" [(cCollapsed)]="isCollapsed" [cLogoConfig]="logoConfig"></c-layout-side>
    </nz-sider>
    <nz-layout [style.marginLeft.px]="isCollapsed ? 50 : 200" [style.marginTop.px]="50">
      <c-layout-header
        [cMenuList]="menuList"
        [cCollapsed]="isCollapsed"
        [cLogoRender]="null"
        [cMenuRight]="rightMenu"
        [style.left.px]="isCollapsed ? 50 : 200"
      ></c-layout-header>
      <nz-content style="margin:0 16px;">
        <div style="padding:24px; background: #fff; min-height: 1360px; margin-top: 20px;">
          <router-outlet></router-outlet>
        </div>
      </nz-content>
    </nz-layout>
  </nz-layout>
  `,
  styles: [`
  nz-sider {
    position: fixed;
    top: 0px;
    bottom: 0;
    box-shadow: 5px 0 4px -4px #ddd;
  }

  nz-content {
    margin: 0 16px;
  }

  c-layout-header {
    position: fixed;
    top: 0;
	left: 0;
    right: 0;
    transition: all .2s;
  }
  `]
})
export class DemoLayoutLogoLeftComponent {
  public isCollapsed = false;
  public menuList = [];
  logoConfig = {
    title: '权限管理',
    outsideIcon: 'menu',
    logoImg: '../assets/logo.png'
  };
}
```

#### LOGO在顶部布局
样式效果，同`LOGO`在左侧布局效果一样；

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'demo-layout-logo-top',
  template: `
  <nz-layout>
    <nz-sider nzCollapsible [(nzCollapsed)]="isCollapsed" [nzTrigger]="null" [nzCollapsedWidth]="isCollapsed ? 50 : 200">
      <c-layout-side [cMenuList]="menuList" [(cCollapsed)]="isCollapsed" [cLogoRender]="null"></c-layout-side>
    </nz-sider>
    <nz-layout [style.marginLeft.px]="isCollapsed ? 50 : 200" [style.marginTop.px]="50">
      <c-layout-header
        [cMenuList]="menuList"
        [cCollapsed]="isCollapsed"
        [cIsLogo]="true"
        [cLogoConfig]="logoConfig"
      [cMenuRight]="rightMenu"></c-layout-header>
      <nz-content style="margin:0 16px;">
        <div style="padding:24px; background: #fff; min-height: 1360px; margin-top: 20px;">
          <router-outlet></router-outlet>
        </div>
      </nz-content>
    </nz-layout>
  </nz-layout>
  `,
  styles: [`
  nz-sider {
    position: fixed;
    top: 50px;
    bottom: 0;
    box-shadow: 5px 0 4px -4px #ddd;
  }

  nz-content {
    margin: 0 16px;
  }

  c-layout-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transition: all .2s;
  }
  `]
})
export class DemoLayoutLogoTopComponent {
  public isCollapsed = false;
  public menuList = [];
  logoConfig = {
    title: '权限管理',
    outsideIcon: 'menu',
    logoImg: '../assets/logo.png'
  };
}

```
