import { Component, OnInit, ViewChild, TemplateRef, ElementRef, Renderer2, ContentChild, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { GridItemDirective } from './grid-item.directive';
import { UpdateHostClassService } from './update-host-class.service';
import { GridLayoutService } from './grid-layout.service';
import { PositionInterface } from './grid.interface';
import { setTransformRtl, setTransform, setTopRight, setTopLeft } from './utils';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'c-grid-item',
  templateUrl: './grid-item.component.html',
  styleUrls: ['./grid-layout.scss'],
  providers: [
    UpdateHostClassService,
  ]
})
export class GridItemComponent implements OnInit {
  @HostBinding('style') style: SafeStyle;
  public cols: number = 1;
  public containerWidth: number = 100;
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

  private el: HTMLElement = this.elementRef.nativeElement;
  private destroyedSubject$: Subject<any> = new Subject();

  @ViewChild('gridItem') content: TemplateRef<any>;
  @ContentChild(GridItemDirective) template: TemplateRef<void>;

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
    private updateHostClassService: UpdateHostClassService,
    private girdLayoutService: GridLayoutService,
  ) {
    // this.renderer.addClass(this.el, 'c-grid-item');
  }

  ngOnInit() {
    this.innerX = this.x;
    this.innerY = this.y;
    this.innerW = this.w;
    this.innerH = this.h;

    this.setClassMap();
    this.cols = this.girdLayoutService.colNum;
    // this.rowHeight = this.girdLayoutService.rowHeight;
    this.containerWidth = this.girdLayoutService.width !== null ? this.girdLayoutService.width : 100;
    this.margin = this.girdLayoutService.margin || [10, 10];
    if (this.isDraggable === null) {
      this.draggable = this.girdLayoutService.isDraggable;
    } else {
      this.draggable = this.isDraggable;
    }

    if (this.isResizable === null) {
      this.resizable = this.girdLayoutService.isResizable;
    } else {
      this.resizable = this.isResizable;
    }

    this.useCssTransforms = this.girdLayoutService.useCssTransforms;
    this.setStyle();

    this.girdLayoutService.widthChange$.pipe(
      takeUntil(this.destroyedSubject$)
    ).subscribe(width => {
      this.containerWidth = width;
      this.setStyle();
    })
  }

  setClassMap(): void {
    this.updateHostClassService.updateHostClass(this.el, {
      'c-grid-item': true,
      'c-resizable': this.resizableAndNotStatic,
      'static': this.static,
      'resizing': this.isResizing,
      'c-draggable-dragging': this.isDragging,
      'cssTransforms': this.useCssTransforms,
      'render-rtl': this.renderRtl,
      'disable-userselect': this.isDragging,
      'no-touch': this.draggableOrResizableAndNotStatic,
    });
  }

  setStyle(): void {
    if (this.x + this.w > this.cols) {
      this.innerX = 0;
      this.innerW = (this.w > this.cols) ? this.cols : this.w;
    } else {
      this.innerX = this.x;
      this.innerW = this.w;
    }

    let pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH);
    console.log(this.dragging, this.isDragging, 'this is dragging.')
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
    // CSS Transforms support (default)
    if (this.useCssTransforms) {
      //                    Add rtl support
      if (this.renderRtl) {
        style = setTransformRtl(pos.top, pos.right, pos.width, pos.height);
      } else {
        style = setTransform(pos.top, pos.left, pos.width, pos.height);
      }

    } else { // top,left (slow)
      //                    Add rtl support
      if (this.renderRtl) {
        style = setTopRight(pos.top, pos.right, pos.width, pos.height);
      } else {
        style = setTopLeft(pos.top, pos.left, pos.width, pos.height);
      }
    }
    this.safeStyle = style;
  }

  private calcPosition(x: number, y: number, w: number, h: number): PositionInterface {
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
      // console.log(w, colWidth, 'this is col width')
      out = {
        left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
        top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
      };
    }
    return out;
  }

  private calcXY(top: number, left: number): { x: number; y: number } {
    const colWidth = this.calcColWidth();
    let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
    let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));

    x = Math.max(Math.min(x, this.cols - this.innerW), 0);
    y = Math.max(Math.min(y, this.maxRows - this.innerH), 0);
    return { x, y };
  }

  private calcColWidth(): number {
    const colWidth = (this.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols;
    return colWidth;
  }
  get resizableAndNotStatic(): boolean {
    return this.resizable && !this.static;
  }

  get renderRtl(): boolean {
    return this.girdLayoutService.isMirrored ? !this.rtl : this.rtl;
  }

  get draggableOrResizableAndNotStatic(): boolean {
    return (this.draggable || this.resizable) && !this.static;
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

  @HostListener('window:resize') onresize(): void {
    this.setStyle();
  }
}
