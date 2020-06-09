import { Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList, Input, ViewEncapsulation, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { UpdateHostClassService } from './update-host-class.service';
import { NgxGridItemComponent } from './ngx-grid-item.component';
import { ILayout, ILayoutCols } from './grid.interface';
import { NgxGridLayoutService } from './ngx-grid-layout.service';
import { validateLayout, compact, getLayoutItem, getAllCollisions } from './utils';
import { equals } from '@interaction/eagle';
import { type } from 'os';


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
export class NgxGridLayoutComponent implements OnInit, OnChanges {
  private ele: HTMLElement = this.elementRef.nativeElement;
  // private _colNum: number = 12;
  // private _autoSize: boolean = true;
  // private _isResizable: boolean = true;
  private destroyed$: Subject<any> = new Subject();

  @ViewChildren(NgxGridItemComponent) listOfNgxGridItemComponent: QueryList<NgxGridItemComponent>;
  @Input() set layout(layout: ILayout[]) {
    this.ngxGridLayoutService.layout = layout;
    this.changeOption('layout', layout);
  }
  get layout(): ILayout[] {
    return this.ngxGridLayoutService.layout;
  }
  @Input() set breakpoints(breakpoints: ILayoutCols) {
    this.ngxGridLayoutService.breakpoints = breakpoints;
    this.changeOption('breakpoints', breakpoints);
  }
  get breakpoints(): ILayoutCols {
    return this.ngxGridLayoutService.breakpoints;
  }
  @Input() set cols(cols: ILayoutCols) {
    this.ngxGridLayoutService.cols = cols;
    this.changeOption('cols', cols);
  }
  get cols(): ILayoutCols {
    return this.ngxGridLayoutService.cols;
  }
  @Input() set useCssTransforms(use: boolean) {
    this.ngxGridLayoutService.useCssTransforms = use;
    this.changeOption('useCssTransforms', use);
  }
  get useCssTransforms(): boolean {
    return this.ngxGridLayoutService.useCssTransforms;
  }
  @Input() set margin(m: number[]) {
    this.ngxGridLayoutService.margin = m;
    this.changeOption('margin', m);
  }
  get margin(): number[] {
    return this.ngxGridLayoutService.margin;
  }
  @Input() set colNum(num: number) {
    this.ngxGridLayoutService.colNum = num;
    this.changeOption('colNum', num);
  }
  get colNum(): number {
    return this.ngxGridLayoutService.colNum;
  }
  @Input() set autoSize(auto: boolean) {
    // this._autoSize = auto;
    this.ngxGridLayoutService.autoSize = auto;
    // this.changeOption('autoSize', auto);
  }
  get autoSize(): boolean {
    // return this._autoSize;
    return this.ngxGridLayoutService.autoSize;
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
    // this.changeOption('preventCollision', prevent);
  }
  get preventCollision(): boolean {
    return this.ngxGridLayoutService.preventCollision;
  }

  @Input() set responsive(respon: boolean) {
    this.ngxGridLayoutService.responsive = respon;
    // this.changeOption('responsive', respon);
  }

  get responsive(): boolean {
    return this.ngxGridLayoutService.responsive;
  }

  @Output() layoutChange: EventEmitter<ILayout[]> = new EventEmitter<ILayout[]>();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private updateClassService: UpdateHostClassService,
    public ngxGridLayoutService: NgxGridLayoutService
  ) {

    this.ngxGridLayoutService.gridLayout$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((result: {type: string; value: any}) => {
      switch(result.type) {
        case 'layout-updated':
          this.layoutChange.emit(result.value);
          break;
        case 'update:layout':
          this.ngxGridLayoutService.layoutUpdate();
          break;
      }
      if (result.type === 'layout-updated') {
        // if (!equals(this.ngxGridLayoutService.layout, result.value)) {
        //   this.ngxGridLayoutService.layout = result.value;
        //   this.ngxGridLayoutService.layoutUpdate();
        // }
      }
    })
    this.ngxGridLayoutService.changeGridLayoutOptions$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((result: { type: string; value: any }) => {
      // if (result.type === 'updateLayout') {
      //   this.layoutChange.emit(result.value)
      // }
    });

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
          console.log(resize, 'this is test.');
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
  }

  setClassMap(): void {
    this.updateClassService.updateHostClass(this.ele, {
      'ngx-grid-layout': true,
      'useCssTransforms': this.useCssTransforms
    });
  }

  private changeOption(type: string, value: any) {
    this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type, value });
  }

}
