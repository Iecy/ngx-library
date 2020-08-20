import { Component, Input, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { LogoConfig, Menu } from './layout.interface';

@Component({
  selector: 'c-layout-header',
  exportAs: 'cLayoutHeader',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-side.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutHeaderComponent {
  public lastRout: string;
  /** 是否展开左侧Logo */
  @Input() public cCollapsed: boolean;
  /** 展开是的宽度：logo区域使用 */
  @Input() public cWidth = 180;
  /** 左侧菜单收起是的宽度：logo区域使用 */
  @Input() public cCollapsedWidth = 50;
  /** 是否显示Logo区域 */
  @Input() public cIsLogo = false;
  /** 自定义菜单右侧template */
  @ViewChild('rightTemplate', { read: ViewContainerRef, static: true }) menuRightContainer: ViewContainerRef;
  /** 自定义菜单左侧头部template */
  @ViewChild('leftBeforeTemplate', { read: ViewContainerRef, static: true }) menuLeftBeforeContainer: ViewContainerRef;
  /** 自定义菜单左侧头部 */
  @Input() set cMenuLeftBefore(template: TemplateRef<void>) {
    if (template) {
      this.menuLeftBeforeContainer.clear();
      this.menuLeftBeforeContainer.createEmbeddedView(template);
    }
  }
  /** 菜单列表 */
  @Input() public cMenuList: Menu[] = [];
  /** 系统logo控制 */
  @Input() public cLogoConfig: LogoConfig;
  /** 自定义头部 */
  @ViewChild('renderLogoTemplate', { static: true }) private renderLogoTemp: TemplateRef<void>;
  @Input() set cLogoRender(logoTmp: TemplateRef<void>) {
    if (logoTmp !== null) {
      this.renderLogoTemp = logoTmp;
    }
  }
  get cLogoRender(): TemplateRef<void> {
    return this.renderLogoTemp;
  }
  /** 右侧 */
  @Input() set cMenuRight(template: TemplateRef<void>) {
    if (template) {
      this.menuRightContainer.clear();
      this.menuRightContainer.createEmbeddedView(template);
    }
  }
  /** 左侧菜单自定义 */
  @ViewChild('renderLeftTemplate', { static: true }) public renderLeftTemp: TemplateRef<void>;
  @Input() set cMenuLeft(menuLeft: TemplateRef<void>) {
    if (menuLeft) {
      this.renderLeftTemp = menuLeft;
    }
  }
  get cMenuLeft(): TemplateRef<void> {
    return this.renderLeftTemp;
  }
  /** 系统统一外部菜单是否展开 */
  @Input() public isOutSideMenuOpen = false;
  @Output() outsideMouseover = new EventEmitter<any>();
  @Output() outsideMouseleave = new EventEmitter<any>();
  @Output() clickMenu = new EventEmitter<Menu>();
  @Output() changeMenu = new EventEmitter<Menu>();

  constructor(
  ) {
  }

  public clickMenus(e: MouseEvent, menu: any) {
    e.stopPropagation();
    this.clickMenu.emit(menu);
  }

  public isLinkActive(active: RouterLinkActive, menu: any): boolean {
    const status = active.isActive && menu.attributes.router;
    if (status && status !== this.lastRout) {
      this.changeMenu.emit(menu);
      this.lastRout = status;
    }
    return status;
  }
}
