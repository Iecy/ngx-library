import { Injectable } from '@angular/core';
import { ILayout, ILayoutCols, IResponsiveLayout } from './grid.interface';
import { Subject, from } from 'rxjs';
import { getLayoutItem, getAllCollisions, cloneLayout, bootom, moveElement } from './utils';
import { getBreakpointFromWidth, getColsFromBreakpoint, findOrGenerateResponsiveLayout } from './responsiveUtils';
import { compact } from './utils';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class NgxGridLayoutService {
  private _containerWidth: number = 100;
  public rowHeight: number = 30;

  public layouts: IResponsiveLayout = {};
  public colNum: number = 12;
  public layout: ILayout[];
  public margin: number[] = [10, 10];
  public useCssTransforms: boolean = true;
  public isDragging = false;
  public isDraggable: boolean = true;
  public isResizable: boolean = true;
  public autoSize: boolean = true;
  public originalLayout = null;
  public lastLayoutLength: number = 0;
  public breakpoints: ILayoutCols = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  public cols: ILayoutCols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
  public lastBreakpoint: any;
  public isMirrored: boolean = false;
  public verticalCompact: boolean = true;
  public preventCollision: boolean = false;
  public responsive: boolean = false;
  public placeholder = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    i: -1
  };

  public changeGridLayoutOptions$: Subject<any> = new Subject();
  public eventBus$: Subject<any> = new Subject();
  public gridLayout$: Subject<any> = new Subject();
  public layout$: Subject<any> = new Subject();

  constructor() { }

  public initResponsiveFeatures() {
    this.layouts = {};
  }

  public layoutUpdate(): void {
    const { layout, originalLayout } = this;
    if (layout !== undefined && originalLayout !== undefined) {
      if (layout.length !== originalLayout.length) {
        let diff = this.findDifference(layout, originalLayout);
        if (diff.length > 0) {
          if (layout.length > originalLayout.length) {
            this.originalLayout = originalLayout.concat(diff);
          } else {
            this.originalLayout = originalLayout.filter(obj => {
              return !diff.some(obj2 => {
                return obj.i === obj2.i;
              });
            });
          }
        }
        this.lastLayoutLength = this.layout.length;
        this.initResponsiveFeatures();
      }
      // console.table(this.layout);
      compact(this.layout, this.verticalCompact);
      this.eventBus$.next({ type: 'updateWidth', value: this.containerWidth });
      this.updateHeight();
    }
  }

  private findDifference(layout: ILayout[], originalLayout: ILayout[]): ILayout[] {
    let uniqueResultOne = layout.filter(function (obj) {
      return !originalLayout.some(function (obj2) {
        return obj.i === obj2.i;
      });
    });

    let uniqueResultTwo = originalLayout.filter(function (obj) {
      return !layout.some(function (obj2) {
        return obj.i === obj2.i;
      });
    });

    return uniqueResultOne.concat(uniqueResultTwo);
  }

  public responsiveGridLayout(eventName?: string): void {
    // const { breakpoints, cols, lastBreakpoint, layouts, layout, originalLayout, verticalCompact } = this;
    let newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.containerWidth);
    let newCols = getColsFromBreakpoint(newBreakpoint, this.cols);

    if (this.lastBreakpoint != null && !this.layouts[this.lastBreakpoint]) {
      this.layouts[this.lastBreakpoint] = cloneLayout(this.layout);
    }

    let layout = findOrGenerateResponsiveLayout(
      this.originalLayout,
      this.layouts,
      this.breakpoints,
      newBreakpoint,
      this.lastBreakpoint,
      newCols,
      this.verticalCompact
    );
    this.layouts[newBreakpoint] = layout;
    this.gridLayout$.next({ type: 'update:layout', value: layout });
    // this.gridLayout$.next({ type: 'layout-updated', value: layout })

    this.lastBreakpoint = newBreakpoint;
    const colNum = getColsFromBreakpoint(newBreakpoint, this.cols);
    this.colNum = colNum;
    // for(let index in this.layout) {
    //   Object.keys(this.layout[index]).forEach(key => {
    //     this.layout[index][key] = layout[index][key];
    //   })
    // }
    this.layout$.next(layout);
    this.changeGridLayoutOptions$.next({ type: 'setColNum', value: colNum });
  }

  public resizeEvent(eventName?: string, id?: any, x?: number, y?: number, h?: number, w?: number): void {
    let l = getLayoutItem(this.layout, id);
    if (l === undefined || l === null) {
      (l as any) = { h: 0, w: 0 }
    }
    let hasCollisions;
    if (this.preventCollision) {
      const collisions = getAllCollisions(this.layout, { ...l, w, h }).filter(
        layoutItem => layoutItem.i !== l.i
      );
      hasCollisions = collisions.length > 0;

      // If we're colliding, we need adjust the placeholder.
      if (hasCollisions) {
        // adjust w && h to maximum allowed space
        let leastX = Infinity,
          leastY = Infinity;
        collisions.forEach(layoutItem => {
          if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x);
          if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y);
        });

        if (Number.isFinite(leastX)) l.w = leastX - l.x;
        if (Number.isFinite(leastY)) l.h = leastY - l.y;
      }
    }
    if (!hasCollisions) {
      l.w = w;
      l.h = h;
    }
    if (eventName === "resizestart" || eventName === "resizemove") {
      this.placeholder.i = id;
      this.placeholder.x = x;
      this.placeholder.y = y;
      this.placeholder.w = l.w;
      this.placeholder.h = l.h;

      this.isDragging = true;
      this.eventBus$.next({ type: 'updateWidth', value: this.containerWidth });
    } else {
      this.isDragging = false;
    }

    if (this.responsive) {
      this.responsiveGridLayout(eventName);
    }
    this.eventBus$.next({ type: 'compact' });
    this.updateHeight();

    if (eventName === 'resizeend') {
      this.gridLayout$.next({ type: 'layout-updated', value: this.layout });
    }
  }

  public dragEvent(eventName: string, id: any, x: number, y: number, h: number, w: number): void {
    let l: any = getLayoutItem(this.layout, id);
    if (l === undefined || l === null) {
      l = { x: 0, y: 0 }
    }

    if (eventName === "dragmove" || eventName === "dragstart") {
      this.placeholder.i = id;
      this.placeholder.x = l.x;
      this.placeholder.y = l.y;
      this.placeholder.w = w;
      this.placeholder.h = h;

      this.isDragging = true;
      this.eventBus$.next({ type: 'updateWidth', value: this.containerWidth });
    } else {
      this.isDragging = false;
    }

    this.layout = moveElement(this.layout, l, x, y, true, this.preventCollision);
    compact(this.layout, this.verticalCompact);
    this.eventBus$.next({ type: 'compact' });
    this.updateHeight();
    if (eventName === 'dragend') {
      this.gridLayout$.next({ type: 'layout-updated', value: this.layout });
    }
  }

  updateHeight(): void {
    this.changeGridLayoutOptions$.next({ type: 'updateHeight', value: this.containerHeight() });
  }

  private containerHeight(): string {
    const height = bootom(this.layout) * (this.rowHeight + this.margin[1]) + this.margin[1] + 'px';
    return height;
  }

  set containerWidth(width: number) {
    this._containerWidth = width;
    this.changeGridLayoutOptions$.next({ type: 'updateWidth', value: width });
  }
  get containerWidth(): number {
    return this._containerWidth;
  }
}
