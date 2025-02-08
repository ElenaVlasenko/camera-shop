import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import store from '../store/store';
import { useEffect } from 'react';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useHiddenOverflow = () => useEffect(() => {
  document.body.style.overflow = 'hidden';

  return () => {
    document.body.style.overflow = '';
  };
}, []);
