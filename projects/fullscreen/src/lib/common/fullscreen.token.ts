import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line:max-line-length
export type FullscreenRequestEvents = 'requestFullscreen' | 'webkitRequestFullscreen' | 'webkitRequestFullScreen' | 'mozRequestFullScreen' | 'msRequestFullscreen';
// tslint:disable-next-line:max-line-length
export type FullscreenExitEvents = 'exitFullscreen' | 'webkitExitFullscreen' | 'webkitCancelFullScreen' | 'mozCancelFullScreen' | 'msExitFullscreen';
export type FullscreenChangeEvents = 'fullscreenchange' | 'webkitfullscreenchange' | 'mozfullscreenchange' | 'MSFullscreenChange';
export type FullscreenErrorEvents = 'fullscreenerror' | 'webkitfullscreenerror' | 'mozfullscreenerror' | 'MSFullscreenError';
// tslint:disable-next-line:max-line-length
export type FullscreenElementKeys = 'fullscreenElement' | 'webkitFullscreenElement' | 'webkitCurrentFullScreenElement' | 'mozFullScreenElement' | 'msFullscreenElement';
// export type FullscreenEnabledKeys = 'fullscreenEnabled' | 'webkitFullscreenEnabled' | 'mozFullscreenEnabled' | 'msFullscreenEnabled';
// tslint:disable-next-line:max-line-length
export type FullscreenEnabledKeys = 'fullscreenEnabled' | 'msFullscreenEnabled' | 'mozFullscreenEnabled' | 'webkitFullscreenEnabled';


export type FullscreenEnabledFunction = (element: HTMLElement) => Observable<boolean>;

export const FULLSCREEN_REQUEST_EVENTS = new InjectionToken<ReadonlyArray<FullscreenRequestEvents>>('fullscreen.request');
export const FULLSCREEN_EXIT_EVENTS = new InjectionToken<ReadonlyArray<FullscreenExitEvents>>('fullscreen.exit');
export const FULLSCREEN_CHANGE_EVENTS = new InjectionToken<ReadonlyArray<FullscreenChangeEvents>>('fullscreen.change');
export const FULLSCREEN_ERROR_EVENTS = new InjectionToken<ReadonlyArray<FullscreenErrorEvents>>('fullscreen.error');
export const FULLSCREEN_ELEMENT_KEYS = new InjectionToken<ReadonlyArray<FullscreenElementKeys>>('fullscreen.element');
export const FULLSCREEN_ENABLED = new InjectionToken<ReadonlyArray<FullscreenEnabledKeys>>('fullscreen.enabled');
export const FULLSCREEN_ENABLED_FUNCTION = new InjectionToken<ReadonlyArray<FullscreenEnabledFunction>>('fullscreen.enabled-function');
export const FULLSCREEN_IOS_POLL_ENABLED = new InjectionToken<boolean>('fullscreen.ios.poll.enabled');
export const FULLSCREEN_IOS_POLL_MS = new InjectionToken<number>('fullscreen.ios.poll.ms');


