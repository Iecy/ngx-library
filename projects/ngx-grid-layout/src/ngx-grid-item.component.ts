import { Component, OnInit, Input, ViewEncapsulation, ElementRef, HostListener, OnChanges, SimpleChanges, HostBinding, Renderer2 } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { UpdateHostClassService } from './update-host-class.service';
import { NgxGridLayoutService } from './ngx-grid-layout.service';
import { takeUntil } from 'rxjs/operators';
import { IPosition } from './grid.interface';
import { setTransformRtl, setTransform, setTopRight, setTopLeft, bootom, compact, cloneLayout } from './utils';
import { getBreakpointFromWidth, getColsFromBreakpoint, findOrGenerateResponsiveLayout } from './responsiveUtils';

@Component({
  selector: 'ngx-grid-item',
  templateUrl: './ngx-grid-item.component.html',
  styleUrls: ['./ngx-grid-layout.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  providers: [
    UpdateHostClassService,
  ]
})
export class NgxGridItemComponent implements OnInit, OnChanges {
  @HostBinding('style') style: SafeStyle;
  private destroyedSubject$: Subject<any> = new Subject<any>();
  public ele: HTMLElement = this.elementRef.nativeElement;

  public containerWidth: number = 100;
  public cols: number = 12;
  public rowHeight: number = 30;
  public margin: number[] = [10, 10];
  public maxRows: number = Infinity;
  public draggable: any;
  public resizable: any;
  public useCssTransforms: boolean = true;
  public isDragging: boolean = false;
  public dragging: any;
  public isResizing: boolean = false;
  public resizing: any;
  public lastX: number = NaN;
  public lastY: number = NaN;
  public lastW: number = NaN;
  public lastH: number = NaN;
  // public style: Object = {};
  public rtl: boolean = false;
  public dragEventSet: boolean = false;
  public resizeEventSet: boolean = false;
  public previousW: number;
  public previousH: number;
  public previousX: number;
  public previousY: number;
  public innerX: number;
  public innerY: number;
  public innerW: number;
  public innerH: number;

  @Input() isDraggable: boolean;
  @Input() isResizable: boolean;
  @Input() static: boolean;
  @Input() minH: number = 1;
  @Input() minW: number = 1;
  @Input() maxH: number = Infinity;
  @Input() maxW: number = Infinity;
  @Input() x: number;
  @Input() y: number;
  @Input() w: number;
  @Input() h: number;
  @Input() i: any;
  @Input() dragIgnoreFrom: string = 'a, button';
  @Input() dragAllowFrom: string;
  @Input() resizeIgnoreFrom: string = 'a, button';

  constructor(
    private sanitizer: DomSanitizer,
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private updateClassService: UpdateHostClassService,
    private gridLayoutService: NgxGridLayoutService,
  ) {
    this.gridLayoutService.changeGridLayoutOptions$.pipe(
      takeUntil(this.destroyedSubject$)
    ).subscribe((result: { type: string; value: any }) => {
      switch (result.type) {
        case 'useCssTransforms':
          console.log('this is use useCssTransforms.');
          break;
        case 'colNum':
          console.log('this is use colNum.');
          this.cols = result.value;
          break;
        case 'margin':
          this.margin = result.value;
          break;
      }
    })
  }

  ngOnInit() {
    this.innerX = this.x;
    this.innerY = this.y;
    this.innerW = this.w;
    this.innerH = this.h;

    this.draggable = this.isDraggable;
    this.resizable = this.isResizable;
    this.containerWidth = this.getParentWidth();
    
    compact(this.gridLayoutService.layout, this.gridLayoutService.verticalCompact);

    this.setClassMap();
    this.createStyle();
    this.setParentHeight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.x) {
      this.innerX = changes.x.currentValue;
    }
    if (changes.y) {
      this.innerY = changes.y.currentValue;
    }
    if (changes.w) {
      this.innerW = changes.w.currentValue;
    }
    if (changes.h) {
      this.innerH = changes.h.currentValue;
    }
  }

  get renderRtl(): boolean {
    return this.gridLayoutService.isMirrored ? !this.rtl : this.rtl;
  }

  set safeStyle(style: string | object) {
    let mappedStyles = style as string;
    if (typeof style === 'object') {
      mappedStyles = Object.entries(style).reduce((styleString, [propName, propValue]) => {
        propName = propName.replace(/([A-Z])/g, matches => `-${matches[0].toLowerCase()}`);
        return `${styleString}${propName}:${propValue};`;
      }, '');

      this.style = this.sanitizer.bypassSecurityTrustStyle(mappedStyles);
    } else if (typeof style === 'string') {
      this.style = this.sanitizer.bypassSecurityTrustStyle(mappedStyles);
    }
  }

  setClassMap(): void {
    this.updateClassService.updateHostClass(this.ele, {
      'ngx-grid-item': true,
    });
  }

  setParentHeight(): void {
    const height = bootom(this.gridLayoutService.layout) * (this.rowHeight + this.margin[1]) + this.margin[1] + 'px';
    this.renderer.setStyle(this.ele.parentElement, 'height', height);
  }

  createStyle(): void {
    if (this.x + this.w > this.cols) {
      this.innerX = 0;
      this.innerW = (this.w > this.cols) ? this.cols : this.w;
    } else {
      this.innerX = this.x;
      this.innerW = this.w;
    }
    let pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
    if (this.isDragging) {
      pos.top = this.dragging.top;
      //                    Add rtl support
      if (this.renderRtl) {
        pos.right = this.dragging.left;
      } else {
        pos.left = this.dragging.left;
      }
    }
    if (this.isResizing) {
      pos.width = this.resizing.width;
      pos.height = this.resizing.height;
    }
    let style;
    if (this.useCssTransforms) {
      if (this.renderRtl) {
        style = setTransformRtl(pos.top, pos.right, pos.width, pos.height);
      } else {
        style = setTransform(pos.top, pos.left, pos.width, pos.height);
      }
    } else {
      if (this.renderRtl) {
        style = setTopRight(pos.top, pos.right, pos.width, pos.height);
      } else {
        style = setTopLeft(pos.top, pos.left, pos.width, pos.height);
      }
    }
    this.safeStyle = style;
  }

  private calcPosition(x: number, y: number, w: number, h: number): IPosition {
    const colWidth = this.calcColWidth();
    let out;
    if (this.renderRtl) {
      out = {
        right: Math.round(colWidth * x + (x + 1) * this.margin[0]),
        top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
      };
    } else {
      out = {
        left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
        top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
      };
    }
    return out;
  }

  private responsiveGridLayout() {
    const { breakpoints, cols, lastBreakpoint, layouts, layout, originalLayout, verticalCompact } = this.gridLayoutService;
    let newBreakpoint = getBreakpointFromWidth(breakpoints, this.containerWidth);
    let newCols = getColsFromBreakpoint(newBreakpoint, cols);

    if (lastBreakpoint != null && !layouts[lastBreakpoint]) {
      this.gridLayoutService.layouts[lastBreakpoint] = cloneLayout(layout);
    }

    let _layout = findOrGenerateResponsiveLayout(
      originalLayout,
      layouts,
      breakpoints,
      newBreakpoint,
      lastBreakpoint,
      newCols,
      verticalCompact
    );
    this.gridLayoutService.layouts[newBreakpoint] = _layout;
    this.gridLayoutService.lastBreakpoint = newBreakpoint;
    const colNum = getColsFromBreakpoint(newBreakpoint, cols);
    this.setColNum(colNum);
  }

  private calcColWidth(): number {
    return (this.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols;
  }

  private getParentWidth(): number {
    return this.ele.parentElement.offsetWidth;
  }

  private updateWidth(): void {
    this.containerWidth = this.getParentWidth();

  }

  private setColNum(colNum: number) {
    this.cols = colNum;
  }

  private resizeEvent(eventName?: any, id?: any, x?: number, y?: number, h?: number, w?: number) {

  }


  @HostListener('window:resize') onResize(): void {
    if (this.getParentWidth() !== this.containerWidth) {
      this.containerWidth = this.getParentWidth();

      compact(this.gridLayoutService.layout, this.gridLayoutService.verticalCompact);

      this.createStyle();
      this.setParentHeight();
    }
  }
}
