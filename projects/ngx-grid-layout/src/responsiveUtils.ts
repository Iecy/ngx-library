import { ILayoutCols, IBreakpoint, ILayout, IResponsiveLayout } from './grid.interface';
import { cloneLayout, compact, correctBounds } from './utils';

export function getBreakpointFromWidth(breakpoints: ILayoutCols, width: number): IBreakpoint {
  const sorted = sortBreakpoints(breakpoints);
  let matching = sorted[0];
  for (let i = 1, len = sorted.length; i < len; i++) {
    const breakpointName = sorted[i];
    if (width > breakpoints[breakpointName]) matching = breakpointName;
  }
  return matching;
}


export function sortBreakpoints(breakpoints: ILayoutCols): Array<IBreakpoint> {
  const keys: Array<string> = Object.keys(breakpoints);
  return keys.sort(function (a, b) {
    return breakpoints[a] - breakpoints[b];
  });
}

export function getColsFromBreakpoint(breakpoint: IBreakpoint, cols: ILayoutCols): number {
  if (!cols[breakpoint]) {
    throw new Error("ResponsiveGridLayout: `cols` entry for breakpoint " + breakpoint + " is missing!");
  }
  return cols[breakpoint];
}

/**
 * Given existing layouts and a new breakpoint, find or generate a new layout.
 * This finds the layout above the new one and generates from it, if it exists.
 * @param  {Array} orgLayout     Original layout.
 * @param  {Object} layouts     Existing layouts.
 * @param  {Array} breakpoints All breakpoints.
 * @param  {String} breakpoint New breakpoint.
 * @param  {String} breakpoint Last breakpoint (for fallback).
 * @param  {Number} cols       Column count at new breakpoint.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout
 *   vertically.
 * @return {Array}             New layout.
 */
export function findOrGenerateResponsiveLayout(orgLayout: ILayout[], layouts: IResponsiveLayout, breakpoints: ILayoutCols,
  breakpoint: IBreakpoint, lastBreakpoint: IBreakpoint,
  cols: number, verticalCompact: boolean): ILayout[] {
  if (layouts[breakpoint]) return cloneLayout(layouts[breakpoint]);
  let layout = orgLayout;

  const breakpointsSorted = sortBreakpoints(breakpoints);
  const breakpointsAbove = breakpointsSorted.slice(breakpointsSorted.indexOf(breakpoint));
  for (let i = 0, len = breakpointsAbove.length; i < len; i++) {
    const b = breakpointsAbove[i];
    if (layouts[b]) {
      layout = layouts[b];
      break;
    }
  }
  layout = cloneLayout(layout || []); // clone layout so we don't modify existing items
  return compact(correctBounds(layout, { cols: cols }), verticalCompact);
}
