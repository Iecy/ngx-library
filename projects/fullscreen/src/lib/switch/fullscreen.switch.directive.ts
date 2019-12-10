import {
  Directive,
  OnDestroy,
  OnInit,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
  Inject,
  NgZone,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { FullscreenService } from 'fullscreen/common/fullscreen.service';
import { FULLSCREEN_IOS_POLL_MS, FULLSCREEN_IOS_POLL_ENABLED } from 'fullscreen/common/fullscreen.token';
import { Subject, combineLatest, interval } from 'rxjs';
import { tap, startWith, delay, flatMap, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { isIphone } from 'fullscreen/common/utils';

export abstract class FullscreenDirective implements OnDestroy, OnInit, OnChanges {

  constructor(
    protected ref: TemplateRef<any>,
    protected viewRef: ViewContainerRef,
    protected fullscreenService: FullscreenService,
    protected cdRef: ChangeDetectorRef,
    @Inject(FULLSCREEN_IOS_POLL_ENABLED) protected iosPollEnabled: boolean,
    @Inject(FULLSCREEN_IOS_POLL_MS) protected iosPollMs: number,
    protected zone: NgZone
  ) { }

  protected abstract elementInputKey?: string;
  private readonly elementSource = new Subject<HTMLElement | undefined>();

  protected showWhenFullscreen = false;
  protected readonly ngOnDestroy$ = new Subject();
  protected readonly element = () => this.elementInputKey ? this[this.elementInputKey] as HTMLElement : undefined;
  // tslint:disable-next-line:member-ordering
  protected readonly element$ = this.elementSource.asObservable();

  ngOnInit(): void {
    combineLatest(
      this.fullscreenService.fullscreen$,
      this.element$.pipe(
        tap(() => this.cdRef.detectChanges()),
        startWith(this.element()),
        delay(0),
        flatMap(element => this.iosPollEnabled && isIphone()
          ? this.zone.runOutsideAngular(() =>
            interval(this.iosPollMs).pipe(
              flatMap(() => this.fullscreenService.fullscreenIsSupported(element)),
              distinctUntilChanged(),
              takeUntil(this.ngOnDestroy$)
            )
          )
          : this.fullscreenService.fullscreenIsSupported(element)
        ),
        takeUntil(this.ngOnDestroy$)
      )
    ).pipe(takeUntil(this.ngOnDestroy$)).subscribe(result => {
      const isFullscreen = result[0];
      const isSupported = result[1];

      this.viewRef.clear();
      if (this.showWhenFullscreen) {
        if (isFullscreen) {
          this.viewRef.createEmbeddedView(this.ref);
        }
      } else if (!isFullscreen) {
        if (isSupported) {
          this.viewRef.createEmbeddedView(this.ref);
        }
      }
      this.cdRef.detectChanges();
    });
  }

  ngOnChanges(simple: SimpleChanges): void {
    if (this.elementInputKey && simple[this.elementInputKey]) {
      this.elementSource.next(simple[this.elementInputKey].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next();
    this.ngOnDestroy$.complete();
  }
}

const IF_FULLSCREEN = 'cIfFullscreen';
@Directive({
  selector: `[${IF_FULLSCREEN}]`,
  // tslint:disable-next-line:use-input-property-decorator
  inputs: [IF_FULLSCREEN]
})
export class FullscreenOnDirective extends FullscreenDirective {

  constructor(
    protected ref: TemplateRef<any>,
    protected viewRef: ViewContainerRef,
    protected fullscreenService: FullscreenService,
    protected cdRef: ChangeDetectorRef,
    @Inject(FULLSCREEN_IOS_POLL_ENABLED) protected iosPollEnabled: boolean,
    @Inject(FULLSCREEN_IOS_POLL_MS) protected iosPollMs: number,
    protected zone: NgZone
  ) {
    super(ref, viewRef, fullscreenService, cdRef, iosPollEnabled, iosPollMs, zone);
    this.showWhenFullscreen = true;
  }

  elementInputKey = IF_FULLSCREEN;
}


const IF_NOT_FULLSCREEN = 'cIfNotFullscreen';
@Directive({
  selector: `[${IF_NOT_FULLSCREEN}]`,
  // tslint:disable-next-line:use-input-property-decorator
  inputs: [IF_NOT_FULLSCREEN]
})
export class FullscreenOffDirective extends FullscreenDirective {
  constructor(
    protected ref: TemplateRef<any>,
    protected viewRef: ViewContainerRef,
    protected fullscreenService: FullscreenService,
    protected cdRef: ChangeDetectorRef,
    @Inject(FULLSCREEN_IOS_POLL_ENABLED) protected iosPollEnabled: boolean,
    @Inject(FULLSCREEN_IOS_POLL_MS) protected iosPollMs: number,
    protected zone: NgZone
  ) {
    super(ref, viewRef, fullscreenService, cdRef, iosPollEnabled, iosPollMs, zone);
    this.showWhenFullscreen = false;
  }

  elementInputKey = IF_NOT_FULLSCREEN;
}
