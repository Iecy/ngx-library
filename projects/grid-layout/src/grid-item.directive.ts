import { Directive } from '@angular/core';

@Directive({
  selector: '[c-grid-item]',
  exportAs: 'cGridItem',
})
export class GridItemDirective {
}
