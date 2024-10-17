import { configureStore } from '@reduxjs/toolkit';
import camerasSlice, { CAMERAS_SLICE_NAME } from './cameras-slice/cameras-slice';
import { camerasApi } from '../api/cameras-api';
import reviewsSlice, { REVIEWS_SLICE_NAME } from './reviews-slice.ts/reviews-slice';
import { reviewsApi } from '../api/reviews-api';
import { orderApi } from '../api/order-api';
import orderSlice, { ORDER_SLICE_NAME } from './order-slice.ts/order-slice';

export const extraArgument = {
  camerasApi,
  reviewsApi,
  orderApi,
};

const store = configureStore({
  reducer: {
    [CAMERAS_SLICE_NAME]: camerasSlice.reducer,
    [REVIEWS_SLICE_NAME]: reviewsSlice.reducer,
    [ORDER_SLICE_NAME]: orderSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument
      },
    }),
});

export default store;
