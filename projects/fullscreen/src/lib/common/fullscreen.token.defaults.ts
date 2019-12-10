import {
  FullscreenRequestEvents,
  FullscreenExitEvents,
  FullscreenChangeEvents,
  FullscreenErrorEvents,
  FullscreenElementKeys,
  FullscreenEnabledKeys,
  FullscreenEnabledFunction
} from './fullscreen.token';
import { of, fromEvent } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const DEFAULT_FULLSCREEN_REQUEST_EVENTS: ReadonlyArray<FullscreenRequestEvents> = [
  'requestFullscreen',
  'webkitRequestFullScreen',
  'webkitRequestFullscreen',
  'mozRequestFullScreen',
  'msRequestFullscreen'
];

export const DEFAULT_FULLSCREEN_EXIT_EVENTS: ReadonlyArray<FullscreenExitEvents> = [
  'exitFullscreen',
  'webkitExitFullscreen',
  'webkitCancelFullScreen',
  'msExitFullscreen',
  'mozCancelFullScreen'
];

export const DEFAULT_FULLSCREEN_CHANGE_EVENTS: ReadonlyArray<FullscreenChangeEvents> = [
  'fullscreenchange',
  'MSFullscreenChange',
  'mozfullscreenchange',
  'webkitfullscreenchange'
];

export const DEFAULT_FULLSCREEN_ERROR_EVENTS: ReadonlyArray<FullscreenErrorEvents> = [
  'fullscreenerror',
  'mozfullscreenerror',
  'MSFullscreenError',
  'webkitfullscreenerror'
];

export const DEFAULT_FULLSCREEN_ELEMENT: ReadonlyArray<FullscreenElementKeys> = [
  'fullscreenElement',
  'msFullscreenElement',
  'mozFullScreenElement',
  'webkitFullscreenElement',
  'webkitCurrentFullScreenElement'
];

export const DEFAULT_FULLSCREEN_ENABLED: ReadonlyArray<FullscreenEnabledKeys> = [
  'fullscreenEnabled',
  'msFullscreenEnabled',
  'mozFullscreenEnabled',
  'webkitFullscreenEnabled'
];

export function DEFAULT_FULLSCREEN_ENABLED_FUNCTION(): FullscreenEnabledFunction {
  const lambda = (element: HTMLElement) => {
    const elm = element instanceof HTMLVideoElement ? element : element.querySelector('video');
    return !elm ? of(false) : (elm as any).readyState >= 2
      ? of(true)
      : fromEvent(elm, 'loadedmetadata').pipe(
        map(event => !event.target ? false : (event.target as any).webkitSupportsFullscreen),
        take(1)
      );
  };
  return lambda;
}

export const DEFAULT_FULLSCREEN_IOS_POLL_ENABLED = true;
export const DEFAULT_FULLSCREEN_IOS_POLL_MS = 60;
