import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Renderer2, ElementRef, Input, HostBinding, ContentChildren, QueryList, OnChanges, SimpleChanges, HostListener, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { InputBoolean, InputNumber, bootom, validateLayout, compact } from './utils';
import { LayoutColsInterface, LayoutInterface, CStyleInterface } from './grid.interface';

import { GridItemComponent } from './grid-item.component';
import { UpdateHostClassService } from './update-host-class.service';
import { GridLayoutService } from './grid-layout.service';

@Component({
  selector: 'c-grid-layout',
  exportAs: 'cGridLayout',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.scss'],
  providers: [
    UpdateHostClassService
  ]
})
export class GridLayoutComponent implements OnInit, OnChanges, AfterContentInit {
  @HostBinding('style.height') height: string;

  @ContentChildren(GridItemComponent) listOfGridItemComponent: QueryList<GridItemComponent>;

  private ele: HTMLElement = this.elementRef.nativeElement;

  public lastLayoutLength: number = 0;
  public isDragging: boolean = false;
  public placeholder: LayoutInterface = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    i: -1
  };
  public layouts: Object = {};
  public lastBreakpoint: null = null;
  public originalLayout: LayoutInterface[] = null;

  @Input() set margin(m: number[]) {
    this.gridLayoutService.margin = m;
  }
  @Input() @InputBoolean() autoSize: boolean = true;
  @Input() @InputNumber() set colNum(col: number) {
    this.gridLayoutService.colNum = (col === undefined || col === null) ? 12 : col;
  }
  @Input() @InputNumber() set rowHeight(height: number) {
    this.gridLayoutService.rowHeight = (height !== undefined && height !== null) ? height : 150;
  }
  @Input() @InputNumber() set maxRows(max: number) {
    this.gridLayoutService.maxRows = max;
  }
  @Input() @InputBoolean() set isDraggable(isDr: boolean) {
    this.gridLayoutService.isDraggable = isDr;
  }
  @Input() @InputBoolean() set isResizable(isRe: boolean) {
    this.gridLayoutService.isResizable = isRe;
  }
  @Input() @InputBoolean() set isMirrored(isMi: boolean) {
    this.gridLayoutService.isMirrored = isMi;
  }
  // @Input() @InputBoolean() useCssTransforms: boolean = true;
  @Input() @InputBoolean() set useCssTransforms(use: boolean) {
    this.gridLayoutService.useCssTransforms = use;
  }
  @Input() @InputBoolean() set verticalCompact(vert: boolean) {
    this.gridLayoutService.verticalCompact = vert;
  }
  @Input() @InputBoolean() set responsive(res: boolean) {
    this.gridLayoutService.responsive = res;
  }
  @Input() @InputBoolean() set preventCollision(prev: boolean) {
    this.gridLayoutService.preventCollision = prev;
  }
  @Input() set breakpoints(breakpoints: LayoutColsInterface) {
    this.gridLayoutService.breakpoints = breakpoints;
  }
  @Input() set cols(cols: LayoutColsInterface) {
    this.gridLayoutService.cols = cols;
  }
  @Input() set layout(la: LayoutInterface[]) {
    this.gridLayoutService.layout = la;
    // this.layoutUpdate();
  }

  get layout(): LayoutInterface[] {
    return this.gridLayoutService.layout;
  }

  // @Input() gridLayoutStyle: CStyleInterface;


  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    private updateHostClassService: UpdateHostClassService,
    private gridLayoutService: GridLayoutService,
  ) {
    this.renderer2.addClass(this.ele, 'c-grid-layout');
    this.gridLayoutService.layoutReady$.subscribe(result => {
      console.log(result, 'this test.');
    })
  }

  ngOnInit() {
    console.log(this.ele.offsetWidth);
    this.setHeight();
    this.setWidth();
    validateLayout(this.layout);

    this.originalLayout = this.layout;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.autoSize) {
      console.log('this is change.');
      this.setHeight();
    }
  }

  ngAfterContentInit(): void {
    // compact(this.layout, this.verticalCompact);
  }

  setHeight(): void {
    console.log(this.gridLayoutService.rowHeight, '====');
    this.height = bootom(this.gridLayoutService.layout) * (this.gridLayoutService.rowHeight + this.gridLayoutService.margin[1]) + this.gridLayoutService.margin[1] + 'px';;
  }

  setWidth(): void {
    if (this.gridLayoutService.width === null) {
      this.gridLayoutService.layoutReady$.next(this.layout);
    }
    const width = this.ele.offsetWidth;
    this.gridLayoutService.width = width;
    this.gridLayoutService.widthChange$.next(width);
    this.setHeight();
  }

  private layoutUpdate(): void {
    if (this.layout !== undefined && this.originalLayout !== null) {
      if (this.layout.length !== this.originalLayout.length) {
        let diff = this.findDifference(this.layout, this.originalLayout);
        if (diff.length > 0) {
          // console.log(diff);
          if (this.layout.length > this.originalLayout.length) {
            this.originalLayout = this.originalLayout.concat(diff);
          } else {
            this.originalLayout = this.originalLayout.filter(obj => {
              return !diff.some(obj2 => {
                return obj.i === obj2.i;
              });
            });
          }
        }

        this.lastLayoutLength = this.layout.length;
        this.initResponsiveFeatures();
      }
      console.log(this.verticalCompact, 'this is verticalCompact ====');
      compact(this.layout, this.verticalCompact);
      // this.eventBus.$emit("updateWidth", this.width);
      // this.updateHeight();
      this.setHeight();
    }
  }

  private findDifference(layout: LayoutInterface[], originalLayout: LayoutInterface[]): LayoutInterface[] {
    let uniqueResultOne = layout.filter(function (obj) {
      return !originalLayout.some(function (obj2) {
        return obj.i === obj2.i;
      });
    });

    //Find values that are in result2 but not in result1
    let uniqueResultTwo = originalLayout.filter(function (obj) {
      return !layout.some(function (obj2) {
        return obj.i === obj2.i;
      });
    });

    return uniqueResultOne.concat(uniqueResultTwo);
  }

  private initResponsiveFeatures(): void {
    this.layouts = {};
  }

  @HostListener('window:resize') onResize() {
    this.setWidth();
    this.setHeight();
  }

}
