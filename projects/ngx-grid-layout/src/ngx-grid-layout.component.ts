import { Component, OnInit, Renderer2, ElementRef, Input, ViewEncapsulation, OnChanges, SimpleChanges, Output, EventEmitter, HostBinding, AfterViewChecked, HostListener, AfterViewInit, AfterContentInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { UpdateHostClassService } from './update-host-class.service';
import { ILayout, ILayoutCols } from './grid.interface';
import { NgxGridLayoutService } from './ngx-grid-layout.service';
import { validateLayout, compact } from './utils';

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
          this.layoutChange.emit(result.value);
          break;
        case 'update:layout':
          this.ngxGridLayoutService.layoutUpdate();
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
    })
  }

  ngOnInit() {
    validateLayout(this.layout);
    this.ngxGridLayoutService.originalLayout = JSON.parse(JSON.stringify(this.layout));
    this.setClassMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.useCssTransforms) {
      this.setClassMap();
    }
    if (changes.layout) {
      validateLayout(changes.layout.currentValue);
      this.ngxGridLayoutService.originalLayout = JSON.parse(JSON.stringify(changes.layout.currentValue));
      this.ngxGridLayoutService.layoutUpdate();
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
    this.ngxGridLayoutService.containerWidth = this.ele.offsetWidth;
    this.ngxGridLayoutService.resizeEvent();
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
