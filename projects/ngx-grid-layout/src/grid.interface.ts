export type IBreakpoint = string;
export interface ILayoutCols {
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
  xxs?: number;
}
export interface IResponsiveLayout {
  lg?: ILayout[];
  md?: ILayout[]; 
  sm?: ILayout[]; 
  xs?: ILayout[]; 
  xxs?: ILayout[];
}

export interface ILayout {
  x: number;
  y: number;
  w: number;
  h: number;
  i: any;
  minW?: number,
  minH?: number,
  maxW?: number,
  maxH?: number,
  moved?: boolean,
  isDraggable?: boolean,
  isResizable?: boolean
  static?: boolean;
}

export interface IPosition {
  right?: number;
  left?: number;
  top: number;
  width: number;
  height: number;
}

export interface ICStyle {
  [klass: string]: any;
}

export interface ICClass {
  [klass: string]: any;
}

