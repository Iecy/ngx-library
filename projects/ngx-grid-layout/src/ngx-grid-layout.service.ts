import { Injectable } from '@angular/core';
import { ILayout, ILayoutCols, IResponsiveLayout } from './grid.interface';
import { Subject } from 'rxjs';

@Injectable()
export class NgxGridLayoutService {
  public layouts: IResponsiveLayout = {};
  public layout: ILayout[];
  public originalLayout = null;
  public lastLayoutLength: number = 0;
  public breakpoints: ILayoutCols = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  public cols: ILayoutCols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
  public lastBreakpoint: any;
  public isMirrored: boolean = false;
  public verticalCompact: boolean = true;
  public changeGridLayoutOptions$: Subject<any> = new Subject();

  constructor() { }
}
