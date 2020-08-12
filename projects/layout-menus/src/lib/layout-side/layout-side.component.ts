import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation, NgZone } from '@angular/core';
import { LogoConfig, Menu } from './layout.interface';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'c-layout-side',
  exportAs: 'cLayoutSide',
  templateUrl: './layout-side.component.html',
  styleUrls: ['./layout-side.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutSideComponent implements OnInit {
  private data: Menu[] = [];
  private unsubscribe$ = new Subject<void>();
  /** 自定义菜单顶部template */
  @ViewChild('menuTop', { read: ViewContainerRef, static: true }) menuTopContainer: ViewContainerRef;
  /** 自定义菜单底部template */
  @ViewChild('menuBottom', { read: ViewContainerRef, static: true }) menuBottomContainer: ViewContainerRef;
  @Input() public cShowTrigger = true;
  @Input() openStrictly = false;
  @Input() recursivePath = true;
  @Input() cPaddingLeft: number = 14;
  /** 菜单列表 */
  @Input() set cMenuList(menus: Menu[]) {
    this.data = menus;
    this.resume();
    this.openedByUrl(this.router.url);
    console.log(this.data, 'this is data.');
  }
  get cMenuList(): Menu[] {
    return this.data;
  }
  /** 左侧菜单是否展开 */
  @Input() public cCollapsed: boolean;
  @Output() public cCollapsedChange: EventEmitter<boolean> = new EventEmitter();
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
  @Input() cShowLogoRender: boolean;
  /** 系统logo控制 */
  @Input() public cLogoConfig: LogoConfig;
  @ViewChild('renderLogoTemplate', { static: true }) public renderLogoTem: TemplateRef<void>;
  @Input() set cLogoRender(cLogo: TemplateRef<void>) {
    if (cLogo !== null) {
      this.renderLogoTem = cLogo;
    }
  }
  get cLogoRender() {
    return this.renderLogoTem;
  }
  /** 自定义菜单元素 */
  @ViewChild('menuItemRouterTemplate', { static: true })
  private _cMenuItemRouter: TemplateRef<{ $implicit: any, size: number }>;
  @Input() set cMenuItemRouter(item: TemplateRef<{ $implicit: any, size: number }>) {
    if (item !== null) {
      this._cMenuItemRouter = item;
    }
  }

  get cMenuItemRouter() {
    return this._cMenuItemRouter;
  }

  @Input() public isOutSideMenuOpen = false;
  @Output() outsideMouseover = new EventEmitter<any>();
  @Output() outsideMouseleave = new EventEmitter<any>();
  @Output() clickMenu = new EventEmitter<any>();

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    console.log('this is layout side.');

    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.openedByUrl(e.urlAfterRedirects);
      }
    });
  }

  public triggerCollapsed(): void {
    this.cCollapsed = !this.cCollapsed;
    this.cCollapsedChange.emit(this.cCollapsed);
  }

  // public expand(e: MouseEvent, item: any): void {
  //   e.stopPropagation();
  //   this.clickMenu.emit(item);
  //   if (item.children && item.children.length) {
  //     item.show = !item.show;
  //   }
  // }

  public toggleMenu(e: MouseEvent, menu: Menu): void {
    // if (!this.cCollapsed) {
    e.stopPropagation();
    menu._open = !menu._open;
    // }
  }

  private resume(callback?: (item: Menu, parentMenu: Menu | null, depth?: number) => void) {
    let i = 1;
    this.visit(this.data, (item, parent, depth) => {
      item._id = i++;
      item._parent = parent;
      item._depth = depth;

      if (!Array.isArray(item.children)) {
        item.children = [];
      }

      if (typeof item.attributes.iconImage === 'string') {
        let type = 'icon';
        let value = item.attributes.iconImage;
        if (/^data:image\//.test(item.attributes.iconImage)) {
          type = 'img';
          (value as any) = this.sanitizer.bypassSecurityTrustUrl(value);
        }
        item.icon = { type, value };
      }
      if (callback) {
        callback(item, parent, depth);
      }
    });
  }

  private visit(data: Menu[], callback: (item: Menu, parentMenu: Menu | null, depth?: number) => void) {
    const inFn = (list: Menu[], parentMenu: Menu | null, depth: number) => {
      for (const item of list) {
        callback(item, parentMenu, depth);
        if (item.children && item.children.length) {
          inFn(item.children, item, depth + 1);
        } else {
          item.children = [];
        }
      }
    };

    inFn(data, null, 0);
  }

  private openedByUrl(url: string | null): void {
    let findItem: Menu | null = this.getHit(this.cMenuList, url, this.recursivePath, (i: Menu) => {
      i._selected = false;
      if (!this.openStrictly) {
        i._open = false;
      }
    });
    if (findItem == null) return;
    do {
      findItem._selected = true;
      if (!this.openStrictly) {
        findItem._open = true;
      }
      findItem = findItem._parent;
    } while (findItem);
  }

  private getHit(data: Menu[], url: string, recusive = false, cb: ((i: Menu) => void) | null = null): Menu | null {
    let item: Menu | null = null;
    while (!item && url) {
      this.visit(data, i => {
        if (cb) {
          cb(i);
        }
        if (i.attributes.router !== null && i.attributes.router === url) {
          item = i;
        }
      });
      if (!recusive) break;
      if (/[?;]/g.test(url)) {
        url = url.split(/[?;]/g)[0];
      } else {
        url = url.split('/').slice(0, -1).join('/');
      }
    }
    return item;
  }

  to(e: MouseEvent, item: Menu): void {
    e.stopPropagation();
    this.clickMenu.emit(item);
    if (item.attributes.outSideRouter) {
      if (item.attributes.target === '_blank') {
        (window as any).open(item.attributes.router);
      } else {
        (window as any).location.href = item.attributes.router;
      }
      return;
    }
    this.ngZone.run(() => this.router.navigateByUrl(item.attributes.router));
  }

}
