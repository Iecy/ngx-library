import { Injectable } from '@angular/core';
import { LayoutColsInterface, LayoutInterface } from './grid.interface';
import { Subject } from 'rxjs';

@Injectable()
export class GridLayoutService {
  public width: number = null;
  public widthChange$: Subject<number> = new Subject<number>();
  public layoutReady$: Subject<any> = new Subject<any>();

  public isMirrored: boolean = false;
  public isResizable: boolean = true;
  public isDraggable: boolean = true;
  public useCssTransforms: boolean = true;
  public verticalCompact: boolean = true;
  public responsive: boolean = false;
  public preventCollision: boolean = false;
  public colNum: number = 12;
  public rowHeight: number = 30;
  public margin: number[] = [10, 10];
  public maxRows: number = Infinity;
  public breakpoints: LayoutColsInterface = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  public cols: LayoutColsInterface = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
  public layout: Array<LayoutInterface>;

  constructor() {
    console.log('this is service.');
  }
}
