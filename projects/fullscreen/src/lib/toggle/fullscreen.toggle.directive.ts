import { Directive, Inject, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { take } from 'rxjs/operators';

import { FullscreenService } from '../common/fullscreen.service';
@Directive({
  selector: '[cFullscreenEnter]'
})
export class FullscreenEnterDirective {

  constructor(
    private fullscreenService: FullscreenService,
    @Inject(DOCUMENT) private doc: any,
    private cdr: ChangeDetectorRef
  ) { }

  private _element: HTMLElement | HTMLDocument;

  @Input()
  get cFullscreenEnter() {
    return this._element;
  }
  set cFullscreenEnter(value: any) {
    if (value instanceof HTMLElement) {
      this._element = value;
    } else {
      this._element = this.doc.body;
    }
  }

  @HostListener('click', []) click() {
    this.cdr.detectChanges();
    this.fullscreenService.isNotFullscreen.pipe(take(1)).subscribe(_ => {
      this.fullscreenService.goFullscreen(this.fullscreenService.extractVideoForIphoneIfRequired(this.cFullscreenEnter));
    });
  }

}
@Directive({
  selector: '[cFullscreenExit]'
})
export class FullscreenExitDirective {
  constructor(
    private fullscreenService: FullscreenService
  ) { }
  @HostListener('click', []) click() {
    this.fullscreenService.exitFullscreen();
  }
}
