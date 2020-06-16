import { Component, OnInit, Input, ViewEncapsulation, ElementRef, HostListener, OnChanges, SimpleChanges, HostBinding, Renderer2, Output, EventEmitter } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import interact from 'interactjs';

import { IPosition } from './grid.interface';
import { NgxGridLayoutService } from './ngx-grid-layout.service';
import { UpdateHostClassService } from './update-host-class.service';
import { getControlPosition, createCoreData } from './draggableUtils';
import { setTransformRtl, setTransform, setTopRight, setTopLeft, compact } from './utils';

import { equals } from '@interaction/eagle';
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
  public draggable: any = null;
  public resizable: any = null;
  public useCssTransforms: boolean = true;
  public isDragging: boolean = false;
  public dragging: any = null;
  public isResizing: boolean = false;
  public resizing: any = null;
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

  @Input() isDraggable: boolean = null;
  @Input() isResizable: boolean = null;
  @Input() static: boolean = false;
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
  @Output() move: EventEmitter<any> = new EventEmitter<any>();
  @Output() moved: EventEmitter<any> = new EventEmitter<any>();
  @Output() resize: EventEmitter<any> = new EventEmitter<any>();
  @Output() resized: EventEmitter<any> = new EventEmitter<any>();

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
        case 'setColNum':
          if (result.value !== this.cols) {
            this.cols = result.value;
            this.tryMakeResizable();
            this.createStyle();
            // this.emitContainerResized();
          }
          break;
        case 'setCols':
          // compact(this.gridLayoutService.layout, this.gridLayoutService.verticalCompact);
          this.tryMakeDraggable();
          this.tryMakeResizable();
          this.createStyle();
          break;
        case 'margin':
          this.margin = result.value;
          break;
        case 'updateHeight':
          if (this.ele.parentElement) {
            this.renderer.setStyle(this.ele.parentElement, 'height', result.value);
          }
          break;
        case 'layout-size-changed':
          this.createStyle();
          break;
        case 'updateLayout':
          compact(this.gridLayoutService.layout, this.gridLayoutService.verticalCompact);
          this.createStyle();
          break;
        case 'containerWidth':
          this.tryMakeResizable();
          this.createStyle();
          // this.emitContainerResized();
          break;
        case 'setDraggable':
          if (this.isDraggable === null) {
            this.draggable = result.value;
            this.tryMakeDraggable();
          }
          break;
        case 'setResizable':
          if (this.isResizable === null) {
            this.resizable = result.value;
            this.tryMakeResizable();
          }
          break;
        case 'setMirrord':
          this.setClassMap();
          this.tryMakeResizable();
          this.tryMakeDraggable();
          this.createStyle();
          break;
        case 'setRowHeight':
          this.createStyle();
          break;
        case 'setUseCssTransforms':
          this.useCssTransforms = result.value;
          this.setClassMap();
          this.createStyle();
          break;
      }
    })

    this.gridLayoutService.eventBus$.pipe(
      takeUntil(this.destroyedSubject$)
    ).subscribe((result: { type: string; value: any }) => {
      switch (result.type) {
        case 'compact':
          this.createStyle();
          break;
        case 'updateWidth':
          this.updateWidth(result.value);
          break;
      }
    })
  }

  ngOnInit() {
    this.innerX = this.x;
    this.innerY = this.y;
    this.innerW = this.w;
    this.innerH = this.h;
    this.dragEventSet = false;
    this.minH = this.minH || 1;
    this.minW = this.minW || 1;
    this.maxW = this.maxW || Infinity;
    this.maxH = this.maxH || Infinity;
    this.useCssTransforms = this.gridLayoutService.useCssTransforms;

    this.initDragable();
    this.initResizable();
    this.setClassMap();
    this.createStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.static) {
      this.tryMakeDraggable();
      this.tryMakeResizable();
    }
    if (changes.x) {
      this.innerX = changes.x.currentValue;
      this.tryMakeDraggable();
      this.tryMakeResizable();
      this.createStyle();
    }
    if (changes.y) {
      this.innerY = changes.y.currentValue;
      this.tryMakeDraggable();
      this.tryMakeResizable();
      this.createStyle();
    }
    if (changes.w) {
      this.innerW = changes.w.currentValue;
      this.tryMakeDraggable();
      this.tryMakeResizable();
      this.createStyle();
    }
    if (changes.h) {
      this.innerH = changes.h.currentValue;
      this.tryMakeDraggable();
      this.tryMakeResizable();
      this.createStyle();
    }
    if (changes.minW) {
      if (this.w < changes.minW.currentValue) {
        this.minW = this.w;
      } else {
        this.minW = changes.minW.currentValue;
      }
      this.tryMakeResizable();
    }
    if (changes.minH) {
      if (this.h < changes.minH.currentValue) {
        this.minH = this.h;
      } else {
        this.minH = changes.minH.currentValue;
      }
      this.tryMakeResizable();
    }
    if (changes.maxW) {
      if (this.w > changes.minW.currentValue) {
        this.maxW = this.w;
      } else {
        this.maxW = changes.maxW.currentValue;
      }
      this.tryMakeResizable();
    }
    if (changes.maxH) {
      if (this.h > changes.maxH.currentValue) {
        this.maxH = this.h;
      } else {
        this.maxH = changes.maxH.currentValue;
      }
      this.tryMakeResizable();
    }
    if (changes.isDraggable) {
      this.draggable = changes.isDraggable.currentValue;
      this.tryMakeDraggable();
    }
    if (changes.isResizable) {
      this.resizable = changes.isResizable.currentValue;
      this.tryMakeResizable();
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
    this.tryMakeDraggable();
  }

  private initResizable(): void {
    if (this.isResizable === null || this.isResizable === undefined) {
      this.resizable = this.gridLayoutService.isResizable;
    } else {
      this.resizable = this.resizable;
    }
    this.tryMakeResizable();
  }

  setClassMap(): void {
    this.updateClassService.updateHostClass(this.ele, {
      'ngx-grid-item': true,
      'ngx-grid-resizable': this.resizable && !this.static,
      'ngx-grid-draggable': this.draggable && !this.static,
      'ngx-grid-static': this.static,
      'ngx-draggable-dragging': this.isDragging,
      'resizing': this.isResizing,
      'disable-userselect': this.isDragging,
      'render-rtl': this.renderRtl,
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

  private tryMakeResizable(): void {
    this.interactObj = null;
    if (this.interactObj === null || this.interactObj === undefined) {
      this.interactObj = interact(this.ele);
    }
    if (this.resizable && !this.static) {
      let maximum = this.calcPosition(0, 0, this.maxW, this.maxH);
      let minimum = this.calcPosition(0, 0, this.minW, this.minH);
      const opts = {
        preserveAspectRatio: true,
        edges: {
          left: false,
          right: "." + (this.renderRtl ? 'ngx-resizable-handle' : 'ngx-resizable-handle'),
          bottom: "." + (this.renderRtl ? 'ngx-resizable-handle' : 'ngx-resizable-handle'),
          top: false
        },
        ignoreFrom: this.resizeIgnoreFrom,
        restrictSize: {
          min: {
            height: minimum.height,
            width: minimum.width
          },
          max: {
            height: maximum.height,
            width: maximum.width
          }
        }
      };

      this.interactObj.resizable(opts);
      if (!this.resizeEventSet) {
        this.resizeEventSet = true;
        this.interactObj
          .on('resizestart resizemove resizeend', event => {
            this.handleResize(event);
          });
      }
    } else {
      this.interactObj.resizable({
        enabled: false
      });
    }
  }

  private tryMakeDraggable(): void {
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
    if (this.static) return;
    if (this.isResizing) return;

    const position = getControlPosition(event);

    if (position === null) return; // not possible but satisfies flow
    const { x, y } = position;
    let newPosition = { top: 0, left: 0 };
    switch (event.type) {
      case "dragstart": {
        this.previousX = this.innerX;
        this.previousY = this.innerY;

        let parentRect = event.target.offsetParent.getBoundingClientRect();
        let clientRect = event.target.getBoundingClientRect();
        if (this.renderRtl) {
          newPosition.left = (clientRect.right - parentRect.right) * -1;
        } else {
          newPosition.left = clientRect.left - parentRect.left;
        }
        newPosition.top = clientRect.top - parentRect.top;
        this.dragging = newPosition;
        this.isDragging = true;
        break;
      }
      case "dragend": {
        if (!this.isDragging) return;
        let parentRect = event.target.offsetParent.getBoundingClientRect();
        let clientRect = event.target.getBoundingClientRect();
        if (this.renderRtl) {
          newPosition.left = (clientRect.right - parentRect.right) * -1;
        } else {
          newPosition.left = clientRect.left - parentRect.left;
        }
        newPosition.top = clientRect.top - parentRect.top;
        // console.log("### drag end => " + JSON.stringify(newPosition));
        //  console.log("### DROP: " + JSON.stringify(newPosition));
        this.dragging = null;
        this.isDragging = false;
        // shouldUpdate = true;
        break;
      }
      case "dragmove": {
        const coreEvent = createCoreData(this.lastX, this.lastY, x, y);
        //  Add rtl support
        if (this.renderRtl) {
          newPosition.left = this.dragging.left - coreEvent.deltaX;
        } else {
          newPosition.left = this.dragging.left + coreEvent.deltaX;
        }
        newPosition.top = this.dragging.top + coreEvent.deltaY;
        // console.log("### drag => " + event.type + ", x=" + x + ", y=" + y);
        // console.log("### drag => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
        // console.log("### drag end => " + JSON.stringify(newPosition));
        this.dragging = newPosition;
        break;
      }
    }

    // Get new XY
    let pos;
    if (this.renderRtl) {
      pos = this.calcXY(newPosition.top, newPosition.left);
    } else {
      pos = this.calcXY(newPosition.top, newPosition.left);
    }

    this.lastX = x;
    this.lastY = y;

    if (this.innerX !== pos.x || this.innerY !== pos.y) {
      // this.$emit("move", this.i, pos.x, pos.y);
      this.move.emit({ i: this.i, x: pos.x, y: pos.y })
    }
    if (event.type === "dragend" && (this.previousX !== this.innerX || this.previousY !== this.innerY)) {
      // this.$emit("moved", this.i, pos.x, pos.y);
      this.moved.emit({ i: this.i, x: pos.x, y: pos.y });
    }
    this.setClassMap();
    this.gridLayoutService.eventBus$.next({
      type: 'dragEvent',
      eventName: event.type,
      value: { i: this.i, x: pos.x, y: pos.y, h: this.innerH, w: this.innerW }
    });
    // this.eventBus.$emit("dragEvent", event.type, this.i, pos.x, pos.y, this.innerH, this.innerW);

  }

  public handleResize(event: any) {
    if (this.static) return;
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
      this.resize.emit({ i: this.i, h: pos.h, w: pos.w, hPx: newSize.height, wPx: newSize.width });
    }
    if (event.type === "resizeend" && (this.previousW !== this.innerW || this.previousH !== this.innerH)) {
      this.resized.emit({ i: this.i, h: pos.h, w: pos.w, hPx: newSize.height, wPx: newSize.width });
    }
    this.setClassMap();
    // this.eventBus.$emit("resizeEvent", event.type, this.i, this.innerX, this.innerY, pos.h, pos.w);
    this.gridLayoutService.eventBus$.next({
      type: 'resizeEvent',
      eventName: event.type,
      value: {
        i: this.i,
        x: this.innerX,
        y: this.innerY,
        h: pos.h,
        w: pos.w
      }
    });
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
    this.containerResized.emit({ i: this.i, h: this.h, w: this.w, hPx: styleProps.height, wPx: styleProps.width })
  }

  private calcXY(top: number, left: number): { x: number; y: number } {
    const colWidth = this.calcColWidth();

    const { rowHeight } = this.gridLayoutService;
    let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
    let y = Math.round((top - this.margin[1]) / (rowHeight + this.margin[1]));

    // Capping
    x = Math.max(Math.min(x, this.cols - this.innerW), 0);
    y = Math.max(Math.min(y, this.maxRows - this.innerH), 0);

    return { x, y };
  }

  private updateWidth(width: number): void {
    this.gridLayoutService.containerWidth = width;
    this.gridLayoutService.changeGridLayoutOptions$.next({ type: 'containerWidth', value: width });
  }

}
