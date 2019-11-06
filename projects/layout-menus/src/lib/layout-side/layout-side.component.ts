import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { LogoConfig } from './layout.interface';

@Component({
  selector: 'c-layout-side',
  exportAs: 'cLayoutSide',
  templateUrl: './layout-side.component.html',
  styleUrls: ['./layout-side.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutSideComponent implements OnInit {
  /** 自定义菜单顶部template */
  @ViewChild('menuTop', { read: ViewContainerRef }) menuTopContainer: ViewContainerRef;
  /** 自定义菜单底部template */
  @ViewChild('menuBottom', { read: ViewContainerRef }) menuBottomContainer: ViewContainerRef;
  /** 菜单列表 */
  @Input() public cMenuList = [];
  /** 左侧菜单是否展开 */
  @Input() public cCollapsed: boolean;
  @Output() public cCollapsedChange: EventEmitter<boolean> = new EventEmitter();
  /** 系统logo控制 */
  @Input() public cLogoConfig: LogoConfig;
  /** 头部 */
  @Input() set cMenuTop(template: TemplateRef<void>) {
    if (template) {
      this.menuTopContainer.clear();
      this.menuTopContainer.createEmbeddedView(template);
    }
  }
  /** 底部 */
  @Input() set cMenuBottom(template: TemplateRef<void>) {
    if (template) {
      this.menuBottomContainer.clear();
      this.menuBottomContainer.createEmbeddedView(template);
    }
  }
  /** 自定义头部 */
  @Input()
  @ViewChild('renderLogoTemplate')
  cLogoRender: TemplateRef<void>;
  /** 自定义菜单元素 */
  @Input()
  @ViewChild('menuItemRouterTemplate')
  cMenuItemRouter: TemplateRef<{ $implicit: any, size: number }>;

  @Input() public isOutSideMenuOpen = false;
  @Output() outsideMouseover = new EventEmitter<any>();
  @Output() outsideMouseleave = new EventEmitter<any>();
  @Output() clickMenu = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  public triggerCollapsed(): void {
    this.cCollapsed = !this.cCollapsed;
    this.cCollapsedChange.emit(this.cCollapsed);
  }

  public expand(e: MouseEvent, item: any): void {
    e.stopPropagation();
    this.clickMenu.emit(item);
    if (item.children && item.children.length) {
      item.show = !item.show;
    }
  }

}
