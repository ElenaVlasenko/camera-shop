import { Camera } from './types';

export const hasId = (id?: Camera['id']) => (camera: Camera) => id === camera.id;
export const isEmpty = <T>(list: T[]) => list.length === 0;

export const scrollToTop = (behavior: ScrollBehavior = 'auto') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior
  });
};

const DEFAULT_ERROR_MESSAGE = 'unknown error';

export const getMessage = (err?: unknown): string => err instanceof Error ? err.message || DEFAULT_ERROR_MESSAGE : DEFAULT_ERROR_MESSAGE;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Throttle = <T extends (...args: any[]) => void>(fn: T, timeout: number) => (...args: Parameters<T>) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Debounce = <T extends (...args: any[]) => void>(fn: T, timeout: number) => (...args: Parameters<T>) => void;

export const throttle: Throttle = (fn, timeout) => {
  let timer: NodeJS.Timeout | null = null;

  return (...args) => {
    if (timer) {
      return;
    }

    const timeoutFn = () => {
      fn(...args);

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    timer = setTimeout(timeoutFn, timeout);
  };
};

export const debounce: Debounce = (fn, timeout = 300) => {
  let timer: NodeJS.Timeout | null = null;

  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(
      () => {
        fn(...args);
      },
      timeout
    );
  };
};
