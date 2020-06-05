import { Component, OnInit, Renderer2, ElementRef, ViewChildren, QueryList, Input, ViewEncapsulation, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';


import { UpdateHostClassService } from './update-host-class.service';
import { NgxGridItemComponent } from './ngx-grid-item.component';
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
export class NgxGridLayoutComponent implements OnInit, OnChanges {
  private ele: HTMLElement = this.elementRef.nativeElement;
  private _useCssTransforms: boolean = true;
  private _margin: number[] = [10, 10];
  private _colNum: number = 12;
  private _autoSize: boolean = true;
  private _isResizable: boolean = true;
  private _isDraggable: boolean = true;

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
    this._useCssTransforms = use;
    this.changeOption('useCssTransforms', use);
  }
  get useCssTransforms(): boolean {
    return this._useCssTransforms;
  }
  @Input() set margin(m: number[]) {
    this._margin = m;
    this.changeOption('margin', m);
  }
  get margin(): number[] {
    return this._margin;
  }
  @Input() set colNum(num: number) {
    this._colNum = num;
    this.changeOption('colNum', num);
  }
  get colNum(): number {
    return this._colNum;
  }
  @Input() set autoSize(auto: boolean) {
    this._autoSize = auto;
    this.changeOption('autoSize', auto);
  }
  get autoSize(): boolean {
    return this._autoSize;
  }
  @Input() set isMirrored(isMi: boolean) {
    this.ngxGridLayoutService.isMirrored = isMi;
    this.changeOption('isMirrored', isMi);
  }
  get isMirrored(): boolean {
    return this.ngxGridLayoutService.isMirrored;
  }
  @Input() set isResizable(isRe: boolean) {
    this._isResizable = isRe;
    this.changeOption('isResizable', isRe);
  }
  get isResizable(): boolean {
    return this._isResizable;
  }
  @Input() set isDraggable(isDr: boolean) {
    this._isDraggable = isDr;
    this.changeOption('isDraggable', isDr);
  }
  get isDraggable(): boolean {
    return this._isDraggable;
  }
  @Input() set verticalCompact(vertical: boolean) {
    this.ngxGridLayoutService.verticalCompact = vertical;
    this.changeOption('verticalCompact', vertical);
  }
  get verticalCompact(): boolean {
    return this.ngxGridLayoutService.verticalCompact;
  }

  @Output() layoutChange: EventEmitter<ILayout[]> = new EventEmitter<ILayout[]>();

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private updateClassService: UpdateHostClassService,
    public ngxGridLayoutService: NgxGridLayoutService
  ) {
    this.ngxGridLayoutService.changeGridLayoutOptions$.subscribe((result: { type: string; value: any }) => {
      if (result.type === 'updateLayout') {
        this.layoutChange.emit(result.value)
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

  private initResponsiveFeatures() {
    this.ngxGridLayoutService.layouts = {};
  }

  private layoutUpdate(): void {
    const { layout, originalLayout } = this.ngxGridLayoutService;
    if (layout !== undefined && originalLayout !== undefined) {
      if (layout.length !== originalLayout.length) {
        let diff = this.findDifference(layout, originalLayout);
        if (diff.length > 0) {
          if (layout.length > originalLayout.length) {
            this.ngxGridLayoutService.originalLayout = originalLayout.concat(diff);
          } else {
            this.ngxGridLayoutService.originalLayout = originalLayout.filter(obj => {
              return !diff.some(obj2 => {
                return obj.i === obj2.i;
              });
            });
          }
        }
        this.ngxGridLayoutService.lastLayoutLength = this.ngxGridLayoutService.layout.length;
      }
      compact(this.ngxGridLayoutService.layout, this.ngxGridLayoutService.verticalCompact);
    }
  }

  private changeOption(type: string, value: any) {
    this.ngxGridLayoutService.changeGridLayoutOptions$.next({ type, value });
  }

}
