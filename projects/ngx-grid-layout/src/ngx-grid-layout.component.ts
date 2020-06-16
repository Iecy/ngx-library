import { Component, OnInit, Renderer2, ElementRef, Input, ViewEncapsulation, OnChanges, SimpleChanges, Output, EventEmitter, HostBinding, AfterViewChecked, HostListener, AfterViewInit, AfterContentInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { UpdateHostClassService } from './update-host-class.service';
import { ILayout, ILayoutCols } from './grid.interface';
import { NgxGridLayoutService } from './ngx-grid-layout.service';
import { validateLayout, compact } from './utils';
import elemenResizeDetector from 'element-resize-detector';

@Component({
  selector: 'ngx-grid-layout',
  templateUrl: './ngx-grid-layout.component.html',
  styleUrls: ['./ngx-grid-layout.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  providers: [
    UpdateHostClassService
  ]
})
export class NgxGridLayoutComponent implements OnInit, OnChanges, AfterViewInit, AfterContentInit {
  private ele: HTMLElement = this.elementRef.nativeElement;
  private destroyed$: Subject<any> = new Subject();
  private erd: any;

  @Input() set layout(layout: ILayout[]) {
    this.ngxGridLayoutService.layout = layout;
  }
  get layout(): ILayout[] {
    return this.ngxGridLayoutService.layout;
  }
  @Input() set breakpoints(breakpoints: ILayoutCols) {
    this.ngxGridLayoutService.breakpoints = breakpoints;
  }
  get breakpoints(): ILayoutCols {
    return this.ngxGridLayoutService.breakpoints;
  }
  @Input() set cols(cols: ILayoutCols) {
    this.ngxGridLayoutService.cols = cols;
  }
  get cols(): ILayoutCols {
    return this.ngxGridLayoutService.cols;
  }
  @Input() set useCssTransforms(use: boolean) {
    this.ngxGridLayoutService.useCssTransforms = use;
  }
  get useCssTransforms(): boolean {
    return this.ngxGridLayoutService.useCssTransforms;
  }
  @Input() set margin(m: number[]) {
    this.ngxGridLayoutService.margin = m;
  }
  get margin(): number[] {
    return this.ngxGridLayoutService.margin;
  }
  @Input() set colNum(num: number) {
    this.ngxGridLayoutService.colNum = num;
  }
  get colNum(): number {
    return this.ngxGridLayoutService.colNum;
  }
  @Input() set autoSize(auto: boolean) {
    this.ngxGridLayoutService.autoSize = auto;
  }
  get autoSize(): boolean {
    return this.ngxGridLayoutService.autoSize;
  }
  @Input() set rowHeight(height: number) {
    this.ngxGridLayoutService.rowHeight = height;
  }
  get rowHeight() {
    return this.ngxGridLayoutService.rowHeight;
  }
  @Input() set isMirrored(isMi: boolean) {
    this.ngxGridLayoutService.isMirrored = isMi;
  }
  get isMirrored(): boolean {
    return this.ngxGridLayoutService.isMirrored;
  }
  @Input() set isResizable(isRe: boolean) {
    this.ngxGridLayoutService.isResizable = isRe;
  }
  get isResizable(): boolean {
    return this.isResizable;
  }
  @Input() set isDraggable(isDr: boolean) {
    this.ngxGridLayoutService.isDraggable = isDr;
  }
  get isDraggable(): boolean {
    return this.ngxGridLayoutService.isDraggable;
  }
  @Input() set verticalCompact(vertical: boolean) {
    this.ngxGridLayoutService.verticalCompact = vertical;
  }
  get verticalCompact(): boolean {
    return this.ngxGridLayoutService.verticalCompact;
  }
  @Input() set preventCollision(prevent: boolean) {
    this.ngxGridLayoutService.preventCollision = prevent;
  }
  get preventCollision(): boolean {
    return this.ngxGridLayoutService.preventCollision;
  }

  @Input() set responsive(respon: boolean) {
    this.ngxGridLayoutService.responsive = respon;
  }

  get responsive(): boolean {
    return this.ngxGridLayoutService.responsive;
  }

  @Output() layoutChange: EventEmitter<ILayout[]> = new EventEmitter<ILayout[]>();
  @Output() layoutReady: EventEmitter<ILayout[]> = new EventEmitter<ILayout[]>();
  @Output() layoutChanged: EventEmitter<ILayout[]> = new EventEmitter<ILayout[]>();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private updateClassService: UpdateHostClassService,
    public ngxGridLayoutService: NgxGridLayoutService
  ) {

    this.ngxGridLayoutService.gridLayout$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((result: { type: string; value: any }) => {
      switch (result.type) {
        case 'layout-updated':
          this.ngxGridLayoutService.layoutUpdate();
          break;
        case 'layout-changed': // layout 改变之后的回调
          this.layoutChanged.emit(result.value);
          break;
        case 'update:layout': // layout 实现双向绑定, 由于放大过于频繁，不适合外部改变监听
          this.layoutChange.emit(result.value);
          break;
        case 'layout-size-changed': // layout size 更改后，需要重新resize页面布局
          compact(this.layout, this.verticalCompact)
          setTimeout(() => this.onWindowResize(), 0);
          break;
      }
    })

    this.ngxGridLayoutService.eventBus$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((result: { type: string; eventName: string; value: any }) => {
      switch (result.type) {
        case 'dragEvent':
          const { i, x, y, h, w } = result.value;
          this.ngxGridLayoutService.dragEvent(result.eventName, i, x, y, h, w);
          break;
        case 'resizeEvent':
          const resize = result.value;
          this.ngxGridLayoutService.resizeEvent(result.eventName, resize.i, resize.x, resize.y, resize.h, resize.w);
          break;
      }
    });
    this.ngxGridLayoutService.layout$.subscribe(res => {
      this.layoutChange.emit(res);
    })
  }

  ngOnInit() {
    validateLayout(this.layout);
    this.ngxGridLayoutService.originalLayout = JSON.parse(JSON.stringify(this.layout));
    this.setClassMap();
    this.onWindowResize();
    this.erd = elemenResizeDetector({
      strategy: "scroll",
      callOnAdd: false,
    });
    this.erd.listenTo(this.ele, () => {
      this.onWindowResize();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.useCssTransforms) {
      this.setClassMap();
    }
    if (changes.layout && changes.layout.currentValue && changes.layout.previousValue) {
      validateLayout(changes.layout.currentValue);
      this.ngxGridLayoutService.layoutUpdate();
    }
    if (changes.isDraggable && changes.isDraggable.previousValue !== undefined) {
      this.ngxGridLayoutService.isDraggable = changes.isDraggable.currentValue;
      this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type: 'setDraggable', value: changes.isDraggable.currentValue });
    }
    if (changes.isResizable && changes.isResizable.previousValue !== undefined) {
      this.ngxGridLayoutService.isResizable = changes.isResizable.currentValue;
      this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type: 'setResizable', value: changes.isResizable.currentValue });
    }
    if (changes.responsive && changes.responsive.previousValue !== undefined) {
      if (!this.responsive) {
        this.ngxGridLayoutService.gridLayout$.next({ type: 'update:layout', value: this.ngxGridLayoutService.originalLayout });
        this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type: 'setColNum', value: this.colNum });
        this.ngxGridLayoutService.layoutUpdate();
      }
      this.onWindowResize();
    }
    if (changes.isMirrored && changes.isMirrored.previousValue !== undefined) {
      this.ngxGridLayoutService.isMirrored = changes.isMirrored.currentValue;
      this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type: 'setMirrord', value: changes.isMirrored.currentValue });
    }
    if (changes.rowHeight && changes.rowHeight.previousValue !== undefined) {
      this.ngxGridLayoutService.rowHeight = changes.rowHeight.currentValue;
      this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type: 'setRowHeight', value: changes.rowHeight.currentValue });
    }
    if (changes.colNum && changes.colNum.previousValue !== undefined) {
      this.ngxGridLayoutService.colNum = changes.colNum.currentValue;
      this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type: 'setColNum', value: changes.colNum.currentValue });
    }
    if (changes.useCssTransforms && changes.useCssTransforms.previousValue !== undefined) {
      this.ngxGridLayoutService.useCssTransforms = changes.useCssTransforms.currentValue;
      this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type: 'setUseCssTransforms', value: changes.useCssTransforms.currentValue });
    }
    if (changes.cols && changes.cols.previousValue !== undefined) {
      this.ngxGridLayoutService.cols = changes.cols.currentValue;
      this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type: 'setCols', value: changes.cols.currentValue });
      this.onWindowResize()
    }
  }
  ngAfterContentInit(): void {
    this.onWindowResize();
    this.ngxGridLayoutService.initResponsiveFeatures();
    this.ngxGridLayoutService.updateHeight();
  }

  ngAfterViewInit(): void {
    this.layoutReady.emit(this.layout);
  }

  onWindowResize(): void {
    this.setWidth(this.ele.offsetWidth);
    this.ngxGridLayoutService.resizeEvent();
  }

  setWidth(width: number): void {
    this.ngxGridLayoutService.containerWidth = width;
    this.ngxGridLayoutService.eventBus$.next({ type: 'updateWidth', value: width });
  }

  setClassMap(): void {
    this.updateClassService.updateHostClass(this.ele, {
      'ngx-grid-layout': true,
      'useCssTransforms': this.useCssTransforms
    });
  }

  @HostListener('window:resize') onResize() {
    this.onWindowResize();
  }

}
