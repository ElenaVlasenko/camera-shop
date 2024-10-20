import { Middleware, configureStore } from '@reduxjs/toolkit';
import { screen } from '@testing-library/react';
import { extraArgument, reducer as storeReducer } from '../store/store';

type Apis = typeof extraArgument;

const createApiDummy = <T extends object>(fake: Partial<T> = {}): T => {
  const handler1 = {
    get: function (target: Partial<T>, prop: keyof T): unknown {
      if (!(prop in target)) {
        throw new Error('not implemented');
      }

      const value = fake[prop];

      return typeof value === 'function' ? value.bind(fake) : value;
    },
  } as ProxyHandler<Partial<T>>;

  return new Proxy(fake, handler1) as T;
};

export const createTestStore = (
  reducer: Partial<typeof storeReducer>,
  fakes: { [key in keyof Apis]?: Partial<Apis[key]> } = {},
  middleware: Middleware = () => (next) => (action) => next(action)
) => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: Object.fromEntries(
        (Object.keys(extraArgument) as (keyof Apis)[]).map((key) => [key, createApiDummy(fakes[key] as object | undefined)])
      ) as Apis,
    },
  }).concat(middleware),
});

export const expectTextOnScreen = (text: string) =>
  expect(screen.queryByText(new RegExp(text, 'i'))).toBeInTheDocument();

export const expectNoTextOnScreen = (text: string) =>
  expect(screen.queryByText(new RegExp(text, 'i'))).toBeNull();
