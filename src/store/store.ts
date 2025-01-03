import { configureStore } from '@reduxjs/toolkit';
import camerasSlice, { CAMERAS_SLICE_NAME } from './cameras-slice/cameras-slice';
import { camerasApi } from '../api/cameras-api';
import reviewsSlice, { REVIEWS_SLICE_NAME } from './reviews-slice.ts/reviews-slice';
import { reviewsApi } from '../api/reviews-api';
import { orderApi } from '../api/order-api';
import orderSlice, { ORDER_SLICE_NAME } from './order-slice.ts/order-slice';
import errorSlice, { ERROR_SLICE_NAME } from './error-slice/error-slice';
import { couponApi } from '../api/coupon-api';

export const extraArgument = {
  camerasApi,
  reviewsApi,
  orderApi,
  couponApi
};

export const reducer = {
  [CAMERAS_SLICE_NAME]: camerasSlice.reducer,
  [REVIEWS_SLICE_NAME]: reviewsSlice.reducer,
  [ORDER_SLICE_NAME]: orderSlice.reducer,
  [ERROR_SLICE_NAME]: errorSlice.reducer,
};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument
      },
    }),
});

export default store;
