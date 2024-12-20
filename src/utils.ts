import { Camera, CameraCounts } from './types';

export const hasId = (id?: Camera['id']) => (camera: Camera) => id === camera.id;
export const isEmpty = <T>(list: T[]) => list.length === 0;

export const getChunks = <T>(list: T[], size: number) => list.reduce<T[][]>(
  (res, item) => {
    if (res.at(-1) === undefined || res.at(-1)?.length === size) {
      res.push([]);
    }

    res.at(-1)?.push(item);

    return res;
  },
  []
);

export const hasEqualItems = <T extends string>(list1: T[], list2: T[]): boolean =>
  list1.length === list2.length
  && list1.every((item) => list2.includes(item));

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

export const makeQueryParameter = (key: string, ...values: string[]): string => {
  const params = new URLSearchParams();
  values.forEach((val) => params.append(key, val));

  return params.toString();
};


export const getDiscount = (orderPrice: number, counts: CameraCounts) => {
  let totalDiscount = 0;
  const totalProductCount = Object.values(counts).reduce((a, b) => a + b, 0);

  if (totalProductCount >= 2) {
    totalDiscount = 3;
  }

  if (totalProductCount >= 3) {
    totalDiscount = 5;
  }

  if (totalProductCount >= 6) {
    totalDiscount = 10;
  }

  if (totalProductCount > 10) {
    totalDiscount = 15;
  }

  if (orderPrice >= 10000 && orderPrice <= 20000) {
    totalDiscount = totalDiscount - 1;
  }

  if (orderPrice > 20000 && orderPrice <= 30000) {
    totalDiscount = totalDiscount - 2;
  }

  if (orderPrice > 30000) {
    totalDiscount = totalDiscount - 3;
  }

  return totalDiscount;
};
