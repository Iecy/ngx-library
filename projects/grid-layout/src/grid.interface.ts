export interface LayoutColsInterface {
  lg: number;
  md: number;
  sm: number;
  xs: number;
  xxs: number;
}

export interface LayoutInterface {
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

export interface PositionInterface {
  right?: number;
  left?: number;
  top: number;
  width: number;
  height: number;
}

export interface CStyleInterface {
  [klass: string]: any;
}

export interface CClassInterface {
  [klass: string]: any;
}

