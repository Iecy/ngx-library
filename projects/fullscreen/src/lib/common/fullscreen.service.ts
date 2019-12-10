import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, merge, fromEvent, throwError, EMPTY, interval, of, Observable } from 'rxjs';
import { debounceTime, map, flatMap, take, tap, takeUntil, distinctUntilChanged, startWith, shareReplay, filter } from 'rxjs/operators';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import {
  FULLSCREEN_REQUEST_EVENTS,
  FullscreenRequestEvents,
  FULLSCREEN_EXIT_EVENTS,
  FullscreenExitEvents,
  FULLSCREEN_ELEMENT_KEYS,
  FullscreenElementKeys,
  FULLSCREEN_CHANGE_EVENTS,
  FullscreenChangeEvents,
  FULLSCREEN_ERROR_EVENTS,
  FullscreenErrorEvents,
  FULLSCREEN_ENABLED,
  FullscreenEnabledKeys,
  FULLSCREEN_ENABLED_FUNCTION,
  FullscreenEnabledFunction,
  FULLSCREEN_IOS_POLL_ENABLED,
  FULLSCREEN_IOS_POLL_MS,
} from './fullscreen.token';
import { isIphone } from './utils';

const isKeyTrue =
  (platformKeys: ReadonlyArray<string>) =>
    (doc: HTMLDocument | HTMLElement) =>
      platformKeys.reduce((acc, current) => acc || doc[current] ? true : false, false);

const fullscreenChangeError =
  (platformKeys: ReadonlyArray<string>) =>
    (doc: HTMLDocument) =>
      merge(...platformKeys.map(key => fromEvent(doc, key))).pipe(debounceTime(0));

const filterAndExecute =
  (ref: HTMLElement | HTMLDocument) =>
    (arr: ReadonlyArray<string>) => {
      const funcStringIndex = arr.findIndex(a => typeof ref[a] === 'function');
      if (funcStringIndex >= 0) {
        ref[arr[funcStringIndex]]();
      }
    };

export interface FullscreenServiceInter {
  readonly fullscreen$: Observable<boolean>;
  readonly isFullscreen$: Observable<boolean>;
  readonly isNotFullscreen: Observable<boolean>;
  readonly exitFullscreen: () => void;
  readonly goFullscreen: (element?: HTMLElement | HTMLDocument) => void;
  readonly canGoFullscreen: (element?: HTMLElement) => Observable<boolean>;
  readonly fullscreenIsSupported: (Element?: HTMLElement) => Observable<boolean>;
  readonly isFullscreen: (elementOrDoc: HTMLDocument | HTMLElement) => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FullscreenService implements FullscreenServiceInter {

  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) private doc: any,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(FULLSCREEN_REQUEST_EVENTS) private requestEventsKeys: FullscreenRequestEvents[],
    @Inject(FULLSCREEN_EXIT_EVENTS) private exitEventsKeys: FullscreenExitEvents[],
    @Inject(FULLSCREEN_ELEMENT_KEYS) private elementKeys: FullscreenElementKeys[],
    @Inject(FULLSCREEN_CHANGE_EVENTS) private changeEventsKeys: FullscreenChangeEvents[],
    @Inject(FULLSCREEN_ERROR_EVENTS) private errorEventsKeys: FullscreenErrorEvents[],
    @Inject(FULLSCREEN_ENABLED) private enabledKeys: FullscreenEnabledKeys[],
    @Inject(FULLSCREEN_ENABLED_FUNCTION) private enabledFunction: FullscreenEnabledFunction,
    @Inject(FULLSCREEN_IOS_POLL_MS) private iosPollMs: number,
    @Inject(FULLSCREEN_IOS_POLL_ENABLED) private iosPollEnabled: boolean,
  ) { }

  private readonly iosVideoState = new BehaviorSubject<boolean>(false);

  public readonly isFullscreen = (doc: HTMLDocument | HTMLElement = this.doc) =>
    isPlatformServer(this.platformId) ? false : isKeyTrue(this.elementKeys)(doc) || this.iosVideoState.getValue()
  private readonly iosVideoBypass = (passThrough: string[]) => isIphone() ? ['webkitEnterFullscreen'] : passThrough;
  public readonly extractVideoForIphoneIfRequired = (element: HTMLElement) => isIphone() && !(element instanceof HTMLVideoElement)
    ? element.querySelector('video') || element
    : element

  private readonly iosPoller = () => !this.iosPollEnabled
    ? EMPTY
    : this.zone.runOutsideAngular(() =>
      interval(this.iosPollMs).pipe(
        map(() => Array.from((this.doc as HTMLDocument).querySelectorAll('video'))),
        flatMap(videoElements => merge(
          ...videoElements.map(ve => fromEvent(ve, 'webkitbeginfullscreen').pipe(tap(() => this.iosVideoState.next(true)), take(1))),
          ...videoElements.map(ve => fromEvent(ve, 'webkitendfullscreen').pipe(tap(() => this.iosVideoState.next(false)), take(1)))
        )), takeUntil(this.iosVideoState)
      )
    )

  // tslint:disable-next-line:member-ordering
  public readonly fullscreenError$ = fullscreenChangeError(this.errorEventsKeys)(this.doc).pipe(map(e => throwError(e)));

  // tslint:disable-next-line:member-ordering
  public readonly fullscreen$ = isPlatformServer(this.platformId)
    ? of(false)
    : merge(
      ...this.changeEventsKeys.map(key => fromEvent(this.doc, key)),
      this.fullscreenError$,
      this.iosPoller()
    ).pipe(
      debounceTime(0),
      map(() => this.isFullscreen()),
      distinctUntilChanged(),
      startWith(this.isFullscreen()),
      shareReplay(1)
    );

  public readonly fullscreenIsSupported =
    (element?: HTMLElement) =>
      (isPlatformServer(this.platformId)
        ? of(false)
        : isKeyTrue(this.enabledKeys)(this.doc)
          ? of(true)
          : !element
            ? of(false)
            : this.enabledFunction(element)).pipe(shareReplay(1))

  public readonly canGoFullscreen =
    (element?: HTMLElement) =>
      (isPlatformServer(this.platformId)
        ? of(false)
        : this.fullscreenIsSupported(element)
          .pipe(flatMap(isSupported => !isSupported
            ? of(false)
            : this.fullscreen$.pipe(map(isFs => isFs ? false : true))))).pipe(shareReplay(1))

  // tslint:disable-next-line:member-ordering
  public readonly isFullscreen$ = this.fullscreen$.pipe(filter(v => v === true));
  // tslint:disable-next-line:member-ordering
  public readonly isNotFullscreen = this.fullscreen$.pipe(filter(v => v === false));
  public readonly exitFullscreen = () => filterAndExecute(this.doc)(this.exitEventsKeys);
  public readonly goFullscreen = (element: HTMLElement | HTMLDocument = this.doc.body) =>
    filterAndExecute(element)(this.iosVideoBypass(this.requestEventsKeys))
}
