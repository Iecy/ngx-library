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
 * @param  orgLayout     Original layout.
 * @param  layouts     Existing layouts.
 * @param  breakpoints All breakpoints.
 * @param  breakpoint New breakpoint.
 * @param  breakpoint Last breakpoint (for fallback).
 * @param  cols       Column count at new breakpoint.
 * @param  verticalCompact Whether or not to compact the layout
 *   vertically.
 * @return             New layout.
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
