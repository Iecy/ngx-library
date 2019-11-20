import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: '[selector]',
})
export class SelectorDirective {
  constructor(private elementRef: ElementRef) {}

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}