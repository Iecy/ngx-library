import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser';

import { LayoutSideComponent } from './layout-side/layout-side.component';
import { LayoutSideRouterComponent } from './layout-side/layout-side-router.component';
import { LayoutHeaderComponent } from './layout-side/layout-header.component';
import { LayoutSliderComponent } from './layout-side/layout-slider.component';

import { IconDefinition } from '@ant-design/icons-angular';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { NzIconModule, NZ_ICON_DEFAULT_TWOTONE_COLOR, NZ_ICONS } from 'ng-zorro-antd/icon';
// 引入你需要的图标，比如你需要 fill 主题的 AccountBook Alert 和 outline 主题的 Alert，推荐 ✔️
import { MenuFoldOutline, MenuOutline } from '@ant-design/icons-angular/icons';
// import { NzMenuModule, NzMenuService, NzMenuBaseService } from 'ng-zorro-antd';
import {NzMenuModule, MenuService} from 'ng-zorro-antd';

const icons: IconDefinition[] = [MenuFoldOutline, MenuOutline];

@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    RouterModule,
    NzToolTipModule,
    NzIconModule,
    NzMenuModule,
  ],
  declarations: [
    LayoutSideComponent,
    LayoutSideRouterComponent,
    LayoutHeaderComponent,
    LayoutSliderComponent
  ],
  exports: [
    LayoutSideComponent,
    LayoutSideRouterComponent,
    LayoutHeaderComponent,
    LayoutSliderComponent,
  ],
  providers: [
    { provide: NZ_ICON_DEFAULT_TWOTONE_COLOR, useValue: '#00ff00' }, // 不提供的话，即为 Ant Design 的主题蓝色
    { provide: NZ_ICONS, useValue: icons },
    MenuService,
  ],
})
export class LayoutMenusModule { }
