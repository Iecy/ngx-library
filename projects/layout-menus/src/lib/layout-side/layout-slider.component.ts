import { Component, OnInit, ViewChild, ViewContainerRef, Input, TemplateRef, ViewEncapsulation, Output, EventEmitter, NgZone, OnDestroy } from '@angular/core';
import { Menu, LogoConfig } from './layout.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'c-layout-slider',
  templateUrl: './layout-slider.component.html',
  styleUrls: ['./layout-side.component.scss', './layout-slider.component.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  providers: [
  ]
})
export class LayoutSliderComponent implements OnInit, OnDestroy {
  public data: Menu[] = [];
  private unsubscribe$ = new Subject<void>();
  /** 自定义菜单顶部template */
  @ViewChild('menuTop', { static: true }) menuTopContainer: ViewContainerRef;
  /** 自定义菜单底部template */
  @ViewChild('menuBottom', { static: true }) menuBottomContainer: ViewContainerRef;

  @Input() cCollapsed: boolean;
  @Input() recursivePath = true;
  @Input() isOutSideMenuOpen = false;
  @Input() openStrictly = false;
  /** 菜单列表 */
  // @Input() public cMenuList: Menu[] = [];
  @Input() set cMenuList(menus: Menu[]) {
    this.data = menus;
    this.resume();

    this.openedByUrl(this.router.url);
  }
  get cMenuList(): Menu[] {
    return this.data;
  }
  @Input() public cShowTrigger = true;
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
  @ViewChild('renderLogoTemplate', { static: true }) public renderLogoTemp: TemplateRef<void>;
  @Input() set cLogoRender(logoRender: TemplateRef<void>) {
    if (logoRender) {
      this.renderLogoTemp = logoRender;
    }
  }
  get cLogoRender(): TemplateRef<void> {
    return this.renderLogoTemp;
  }

  @Output() outsideMouseover = new EventEmitter<any>();
  @Output() outsideMouseleave = new EventEmitter<any>();
  @Output() clickMenu = new EventEmitter<Menu>();
  @Output() public cCollapsedChange: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.openedByUrl(e.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private resume(callback?: (item: Menu, parentMenu: Menu | null, depth?: number) => void) {
    let i = 1;
    this.visit(this.data, (item, parent, depth) => {
      item._id = i++;
      item._parent = parent;
      item._depth = depth;
      item._text = this.sanitizer.bypassSecurityTrustHtml(item.attributes.title);

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

  to(item: Menu): void {
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

  public triggerCollapsed(): void {
    this.cCollapsed = !this.cCollapsed;
    this.cCollapsedChange.emit(this.cCollapsed);
  }
}
