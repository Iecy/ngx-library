import { coerceBooleanProperty, _isNumberValue } from '@angular/cdk/coercion';
import { ILayout } from './grid.interface';

function propDecoratorFactory<T, D>(name: string, fallback: (v: T) => D): (target: any, propName: string) => void {
  function propDecorator(target: any, propName: string, originalDescriptor?: TypedPropertyDescriptor<any>): any {
    const privatePropName = `$$__${propName}`;

    if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
      console.warn(`The prop "${privatePropName}" is already exist, it will be overrided by ${name} decorator.`);
    }

    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true
    });

    return {
      get(): string {
        return originalDescriptor && originalDescriptor.get
          ? originalDescriptor.get.bind(this)()
          : this[privatePropName];
      },
      set(value: T): void {
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.bind(this)(fallback(value));
        }
        this[privatePropName] = fallback(value);
      }
    };
  }

  return propDecorator;

}

export function toBoolean(value: boolean | string): boolean {
  return coerceBooleanProperty(value);
}

export function toNumber(value: number | string): number;
export function toNumber<D>(value: number | string, fallback: D): number | D;
export function toNumber(value: number | string, fallbackValue: number = 0): number {
  return _isNumberValue(value) ? Number(value) : fallbackValue;
}

export function InputBoolean(): any {
  return propDecoratorFactory('InputBoolean', toBoolean);
}

export function InputNumber(): any {
  return propDecoratorFactory('InputNumber', toNumber);
}

export function bootom(layout: ILayout[]) {
  let max = 0, bottomY;
  for (let i = 0, len = layout.length; i < len; i++) {
    bottomY = layout[i].y + layout[i].h;
    if (bottomY > max) max = bottomY;
  }
  return max;
}

export function cloneLayout(layout: ILayout[]): ILayout[] {
  const newLayout = Array(layout.length);
  for (let i = 0, len = layout.length; i < len; i++) {
    newLayout[i] = cloneLayoutItem(layout[i]);
  }
  return newLayout;
}

export function cloneLayoutItem(layoutItem: ILayout): ILayout {
  return JSON.parse(JSON.stringify(layoutItem));
}

/**
 * Helper to convert a number to a percentage string.
 *
 * @param  num Any number
 * @return     That number as a percentage.
 */
export function perc(num: number): string {
  return num * 100 + '%';
}

export function validateLayout(layout: ILayout[], contextName?: string): void {
  contextName = contextName || "Layout";
  const subProps = ['x', 'y', 'w', 'h'];
  if (!Array.isArray(layout)) throw new Error(contextName + " must be an array!");
  for (let i = 0, len = layout.length; i < len; i++) {
    const item = layout[i];
    for (let j = 0; j < subProps.length; j++) {
      if (typeof item[subProps[j]] !== 'number') {
        throw new Error('CGridLayout: ' + contextName + '[' + i + '].' + subProps[j] + ' must be a number!');
      }
    }
    if (item.i && typeof item.i !== 'string') {
      // number is also ok, so comment the error
      // TODO confirm if commenting the line below doesn't cause unexpected problems
      // throw new Error('VueGridLayout: ' + contextName + '[' + i + '].i must be a string!');
    }
    if (item.static !== undefined && typeof item.static !== 'boolean') {
      throw new Error('CGridLayout: ' + contextName + '[' + i + '].static must be a boolean!');
    }
  }
}

export function compact(layout: ILayout[], verticalCompact: boolean): ILayout[] {
  const compareWith = getStatics(layout);
  // We go through the items by row and column.
  const sorted = sortLayoutItemsByRowCol(layout);
  // Holding for new items.
  const out = Array(layout.length);

  for (let i = 0, len = sorted.length; i < len; i++) {
    let l = sorted[i];

    // Don't move static elements
    if (!l.static) {
      l = compactItem(compareWith, l, verticalCompact);

      // Add to comparison array. We only collide with items before this one.
      // Statics are already in this array.
      compareWith.push(l);
    }

    // Add to output array to make sure they still come out in the right order.
    out[layout.indexOf(l)] = l;

    // Clear moved flag, if it exists.
    l.moved = false;
  }

  return out;
}

/**
 * Given a layout, make sure all elements fit within its bounds.
 * @param layout Layout array.
 * @param  bounds Number of columns.
 */
export function correctBounds(layout: ILayout[], bounds: {cols: number}): ILayout[] {
  const collidesWith = getStatics(layout);
  for (let i = 0, len = layout.length; i < len; i++) {
    const l = layout[i];
    // Overflows right
    if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w;
    // Overflows left
    if (l.x < 0) {
      l.x = 0;
      l.w = bounds.cols;
    }
    if (!l.static) collidesWith.push(l);
    else {
      // If this is static and collides with other statics, we must move it down.
      // We have to do something nicer than just letting them overlap.
      while(getFirstCollision(collidesWith, l)) {
        l.y++;
      }
    }
  }
  return layout;
}

export function getStatics(layout: ILayout[]): ILayout[] {
  return layout.filter((l) => l.static);
}

export function sortLayoutItemsByRowCol(layout: ILayout[]): ILayout[] {
  return [].concat(layout).sort(function (a, b) {
    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1;
    }
    return -1;
  });
}

export function compactItem(compareWith: ILayout[], l: ILayout, verticalCompact: boolean): ILayout {
  if (verticalCompact) {
    // Move the element up as far as it can go without colliding.
    while (l.y > 0 && !getFirstCollision(compareWith, l)) {
      l.y--;
    }
  }

  // Move it down, and keep moving it down if it's colliding.
  let collides;
  while ((collides = getFirstCollision(compareWith, l))) {
    l.y = collides.y + collides.h;
  }
  return l;
}

/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param  layoutItem Layout item.
 * @return  A colliding layout item, or undefined.
 */
export function getFirstCollision(layout: ILayout[], layoutItem: ILayout): ILayout {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i], layoutItem)) return layout[i];
  }
}

export function getAllCollisions(layout: ILayout[], layoutItem: ILayout): ILayout[] {
  return layout.filter((l) => collides(l, layoutItem));
}

/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  layout Layout array.
 * @param  id     ID
 * @return Item at ID.
 */
export function getLayoutItem(layout: ILayout[], id: string): ILayout {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (layout[i].i === id) return layout[i];
  }
  return null;
}

export function collides(l1: ILayout, l2: ILayout): boolean {
  if (l1 === l2) return false; // same element
  if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
  if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
  if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
  if (l1.y >= l2.y + l2.h) return false; // l1 is below l2
  return true; // boxes overlap
}

export function setTransform(top: number, left: number, width: number, height: number): Object {
  // Replace unitless items with px
  const translate = "translate3d(" + left + "px," + top + "px, 0)";
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: width + "px",
    height: height + "px",
    position: 'absolute'
  };
}
/**
 * Just like the setTransform method, but instead it will return a negative value of right.
 * @param top
 * @param right
 * @param width
 * @param height
 */
export function setTransformRtl(top: number, right: number, width: number, height: number): Object {
  const translate = "translate3d(" + right * -1 + "px," + top + "px, 0)";
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: width + "px",
    height: height + "px",
    position: 'absolute'
  };
}

export function setTopLeft(top: number, left: number, width: number, height: number): Object {
  return {
    top: top + "px",
    left: left + "px",
    width: width + "px",
    height: height + "px",
    position: 'absolute'
  };
}

/**
 * Just like the setTopLeft method, but instead, it will return a right property instead of left.
 *
 * @param top
 * @param right
 * @param width
 * @param height
 */
export function setTopRight(top: number, right: number, width: number, height: number): Object {
  return {
    top: top + "px",
    right: right + "px",
    width: width + "px",
    height: height + "px",
    position: 'absolute'
  };
}

export function moveElement(layout: ILayout[], l: ILayout,x: number, y: number, isUserAction: boolean, preventCollision?: boolean): ILayout[] {
  if (l.static) return layout;
  const oldX = l.x;
  const oldY = l.y;

  const movingUp = y && l.y > y;
  // This is quite a bit faster than extending the object
  if (typeof x === 'number') l.x = x;
  if (typeof y === 'number') l.y = y;
  l.moved = true;
  let sorted = sortLayoutItemsByRowCol(layout);
  if (movingUp) sorted = sorted.reverse();
  const collisions = getAllCollisions(sorted, l);

  if (preventCollision && collisions.length) {
    l.x = oldX;
    l.y = oldY;
    l.moved = false;
    return layout;
  }
  for (let i = 0, len = collisions.length; i < len; i++) {
    const collision = collisions[i];
    // console.log('resolving collision between', l.i, 'at', l.y, 'and', collision.i, 'at', collision.y);

    // Short circuit so we can't infinite loop
    if (collision.moved) continue;

    // This makes it feel a bit more precise by waiting to swap for just a bit when moving up.
    if (l.y > collision.y && l.y - collision.y > collision.h / 4) continue;

    // Don't move static items - we have to move *this* element away
    if (collision.static) {
      layout = moveElementAwayFromCollision(layout, collision, l, isUserAction);
    } else {
      layout = moveElementAwayFromCollision(layout, l, collision, isUserAction);
    }
  }

  return layout;
}

export function moveElementAwayFromCollision(layout: ILayout[], collidesWith: ILayout, itemToMove: ILayout, isUserAction?: boolean): ILayout[] {
  const preventCollision = false 
  if (isUserAction) {
    // Make a mock item so we don't modify the item here, only modify in moveElement.
    const fakeItem: ILayout = {
      x: itemToMove.x,
      y: itemToMove.y,
      w: itemToMove.w,
      h: itemToMove.h,
      i: '-1'
    };
    fakeItem.y = Math.max(collidesWith.y - itemToMove.h, 0);
    if (!getFirstCollision(layout, fakeItem)) {
      return moveElement(layout, itemToMove, undefined, fakeItem.y, preventCollision);
    }
  }

  return moveElement(layout, itemToMove, undefined, itemToMove.y + 1, preventCollision);
}
