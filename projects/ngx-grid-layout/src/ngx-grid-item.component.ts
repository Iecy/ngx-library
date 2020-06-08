import { Component, OnInit, Input, ViewEncapsulation, ElementRef, HostListener, OnChanges, SimpleChanges, HostBinding, Renderer2, Output, EventEmitter } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { UpdateHostClassService } from './update-host-class.service';
import { NgxGridLayoutService } from './ngx-grid-layout.service';
import { takeUntil } from 'rxjs/operators';
import { IPosition, ILayout } from './grid.interface';
import { setTransformRtl, setTransform, setTopRight, setTopLeft, bootom, compact, cloneLayout } from './utils';
// import * as interact from '@interactjs/types';
import interact from 'interactjs';
// import {} from '@interactjs/types';
import { getControlPosition, createCoreData } from './draggableUtils';

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
  private _style: string | object;
  @HostBinding('style') style: SafeStyle;
  private destroyedSubject$: Subject<any> = new Subject<any>();
  public ele: HTMLElement = this.elementRef.nativeElement;
  private interactObj = null;

  public cols: number = 12;
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

  @Output() containerResized: EventEmitter<any> = new EventEmitter<any>();

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
        case 'setColNum':
          if (result.value !== this.cols) {
            this.cols = result.value;
            this.tryMakeResizable();
            this.createStyle();
            this.emitContainerResized();
          }
          break;
        case 'margin':
          this.margin = result.value;
          break;
        case 'updateHeight':
          if (this.ele.parentElement) {
            this.renderer.setStyle(this.ele.parentElement, 'height', result.value);
          }
          break;
        case 'updateWidth':
          // this.gridLayoutService.containerWidth = this.getParentWidth();
          break;
        case 'updateLayout':
          compact(this.gridLayoutService.layout, this.gridLayoutService.verticalCompact);
          this.createStyle();
          break;
        case 'compact':
          // console.log('this is test. compact')
          this.createStyle();
          break;
      }
    })
  }

  ngOnInit() {
    this.innerX = this.x;
    this.innerY = this.y;
    this.innerW = this.w;
    this.innerH = this.h;

    // this.draggable = this.isDraggable;
    this.initDragable();
    this.initResizable();
    // this.resizable = this.isResizable;
    this.gridLayoutService.containerWidth = this.getParentWidth();

    compact(this.gridLayoutService.layout, this.gridLayoutService.verticalCompact);

    this.setClassMap();
    this.createStyle();
    // this.gridLayoutService.updateHeight();
    if (!this.gridLayoutService.responsive) {
      this.gridLayoutService.changeGridLayoutOptions$.next({ type: 'setCol', value: this.gridLayoutService.colNum });
    }
    this.gridLayoutService.resizeEvent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.x) {
      this.innerX = changes.x.currentValue;
      this.createStyle();
    }
    if (changes.y) {
      this.innerY = changes.y.currentValue;
      this.createStyle();
    }
    if (changes.w) {
      this.innerW = changes.w.currentValue;
      this.createStyle();
    }
    if (changes.h) {
      this.innerH = changes.h.currentValue;
      this.createStyle();
    }
  }

  get renderRtl(): boolean {
    return this.gridLayoutService.isMirrored ? !this.rtl : this.rtl;
  }

  set safeStyle(style: string | object) {
    let mappedStyles = style as string;
    this._style = style;
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

  private initDragable(): void {
    if (this.isDraggable === null || this.isDraggable === undefined) {
      this.draggable = this.gridLayoutService.isDraggable;
    } else {
      this.draggable = this.draggable;
    }
  }

  private initResizable(): void {
    if (this.isResizable === null || this.isResizable === undefined) {
      this.resizable = this.gridLayoutService.isResizable;
    } else {
      this.resizable = this.resizable;
    }
  }

  setClassMap(): void {
    this.updateClassService.updateHostClass(this.ele, {
      'ngx-grid-item': true,
    });
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
    const { rowHeight } = this.gridLayoutService;
    let out;
    if (this.renderRtl) {
      out = {
        right: Math.round(colWidth * x + (x + 1) * this.margin[0]),
        top: Math.round(rowHeight * y + (y + 1) * this.margin[1]),
        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
        height: h === Infinity ? h : Math.round(rowHeight * h + Math.max(0, h - 1) * this.margin[1])
      };
    } else {
      out = {
        left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
        top: Math.round(rowHeight * y + (y + 1) * this.margin[1]),
        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
        height: h === Infinity ? h : Math.round(rowHeight * h + Math.max(0, h - 1) * this.margin[1])
      };
    }
    return out;
  }

  private calcWH(height: number, width: number): { w: number; h: number } {
    const colWidth = this.calcColWidth();

    let w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]));
    let h = Math.round((height + this.margin[1]) / (this.gridLayoutService.rowHeight + this.margin[1]));

    w = Math.max(Math.min(w, this.cols - this.innerX), 0);
    h = Math.max(Math.min(h, this.maxRows - this.innerY), 0);
    return { w, h };
  }

  private calcColWidth(): number {
    return (this.gridLayoutService.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols;
  }

  private getParentWidth(): number {
    return this.ele.parentElement.offsetWidth;
  }

  private tryMakeResizable(): void {
    console.log(1);
    if (this.interactObj === null || this.interactObj === undefined) {
      this.interactObj = interact(this.ele);
    }
    if (this.draggable && !this.static) {
      const opts = {
        ignoreFrom: this.dragIgnoreFrom,
        allowFrom: this.dragAllowFrom
      };
      this.interactObj.draggable(opts);
      if (!this.dragEventSet) {
        this.dragEventSet = true;
        this.interactObj.on('dragstart dragmove dragend', event => {
          this.handleDrag(event);
        });
      }
    } else {
      this.interactObj.draggable({
        enabled: false
      });
    }
  }

  public handleDrag(event) {
    console.log(event, 'this is event.');
    if (this.static) return;
    if (this.isResizing) return;
    const position = getControlPosition(event);
    if (position == null) return; // not possible but satisfies flow
    const { x, y } = position;
    const newSize = { width: 0, height: 0 };
    let pos;
    switch (event.type) {
      case "resizestart": {
        this.previousW = this.innerW;
        this.previousH = this.innerH;
        pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
        newSize.width = pos.width;
        newSize.height = pos.height;
        this.resizing = newSize;
        this.isResizing = true;
        break;
      }
      case "resizemove": {
        const coreEvent = createCoreData(this.lastW, this.lastH, x, y);
        if (this.renderRtl) {
          newSize.width = this.resizing.width - coreEvent.deltaX;
        } else {
          newSize.width = this.resizing.width + coreEvent.deltaX;
        }
        newSize.height = this.resizing.height + coreEvent.deltaY;

        ///console.log("### resize => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
        this.resizing = newSize;
        break;
      }
      case "resizeend": {
        //console.log("### resize end => x=" +this.innerX + " y=" + this.innerY + " w=" + this.innerW + " h=" + this.innerH);
        pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
        newSize.width = pos.width;
        newSize.height = pos.height;
        this.resizing = null;
        this.isResizing = false;
        break;
      }
    }

    // Get new WH
    pos = this.calcWH(newSize.height, newSize.width);
    if (pos.w < this.minW) {
      pos.w = this.minW;
    }
    if (pos.w > this.maxW) {
      pos.w = this.maxW;
    }
    if (pos.h < this.minH) {
      pos.h = this.minH;
    }
    if (pos.h > this.maxH) {
      pos.h = this.maxH;
    }

    if (pos.h < 1) {
      pos.h = 1;
    }
    if (pos.w < 1) {
      pos.w = 1;
    }

    this.lastW = x;
    this.lastH = y;

    if (this.innerW !== pos.w || this.innerH !== pos.h) {
      // this.$emit("resize", this.i, pos.h, pos.w, newSize.height, newSize.width);
      this.gridLayoutService.gridLayout$.next({ type: 'resize', value: { i: this.i, y: pos.h, x: pos.w, h: newSize.height, w: newSize.width } })
    }
    if (event.type === "resizeend" && (this.previousW !== this.innerW || this.previousH !== this.innerH)) {
      // this.$emit("resized", this.i, pos.h, pos.w, newSize.height, newSize.width);
      this.gridLayoutService.gridLayout$.next({
        type: 'resizeend',
        value: { i: this.i, y: pos.h, x: pos.w, h: newSize.height, w: newSize.width },
      });
    }
    this.gridLayoutService.resizeEvent(event.type, this.i, this.innerX, this.innerY, pos.h, pos.w);
  }

  public emitContainerResized(): void {
    let styleProps: any = {};
    for (let prop of ['width', 'height']) {
      let val = this._style[prop];
      let matches = val.match(/^(\d+)px$/);
      if (!matches)
        return;
      styleProps[prop] = matches[1];
    }
    this.containerResized.emit({i: this.i, h: this.h, w: this.w, hPx: styleProps.height, wPx: styleProps.width})
  }


  @HostListener('window:resize') onResize(): void {
    if (this.getParentWidth() !== this.gridLayoutService.containerWidth) {
      this.gridLayoutService.containerWidth = this.getParentWidth();

      this.gridLayoutService.resizeEvent();
    }
  }
}
