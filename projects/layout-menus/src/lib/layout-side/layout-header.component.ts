import { Component, Input, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { LogoConfig } from './layout.interface';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'c-layout-header',
  exportAs: 'cLayoutHeader',
  templateUrl: './layout-header.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LayoutHeaderComponent {
  @Input() public cCollapsed: boolean;
  @Input() public cIsLogo = false;
  /** 自定义菜单右侧template */
  @ViewChild('rightTemplate', { read: ViewContainerRef }) menuRightContainer: ViewContainerRef;
  /** 菜单列表 */
  @Input() public cMenuList = [];
  /** 系统logo控制 */
  @Input() public cLogoConfig: LogoConfig;
  /** 自定义头部 */
  @Input()
  @ViewChild('renderLogoTemplate')
  cLogoRender: TemplateRef<void>;
  /** 右侧 */
  @Input() set cMenuRight(template: TemplateRef<void>) {
    if (template) {
      this.menuRightContainer.clear();
      this.menuRightContainer.createEmbeddedView(template);
    }
  }
  @Input()
  @ViewChild('renderLeftTemplate')
  cMenuLeft: TemplateRef<void>;

  @Input() public isOutSideMenuOpen = false;
  @Output() outsideMouseover = new EventEmitter<any>();
  @Output() outsideMouseleave = new EventEmitter<any>();
  @Output() clickMenu = new EventEmitter<any>();
  @Output() changeMenu = new EventEmitter<any>();
  public lastRout = '';

  constructor(
  ) {
  }

  public clickMenus(e: MouseEvent, menu: any) {
    e.stopPropagation();
    this.clickMenu.emit(menu);
  }

  isLinkActive(active: RouterLinkActive, menu: any): boolean {
    const status = active.isActive && menu.attributes.router;
    if (status && status !== this.lastRout) {
      this.changeMenu.emit(menu);
      this.lastRout = status;
    }
    return status;
  }
}
