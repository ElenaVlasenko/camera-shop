import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { OrderParams } from '../../types';
import { OrderApi } from '../../api/order-api';
import { showErrorMessage } from '../error-slice/error-slice';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

// eslint-disable-next-line @typescript-eslint/ban-types
export type OrderState = {}

export const defaultState: OrderState = {
};

export const ORDER_SLICE_NAME = 'order';

export const makeOrderSlice = (initialState = defaultState) => createSliceWithThunks({
  name: ORDER_SLICE_NAME,
  initialState,
  selectors: {
  },
  reducers: (create) => ({
    addOrderAction: create.asyncThunk<void, OrderParams, { extra: { orderApi: OrderApi } }>(
      (order, { extra: { orderApi }, dispatch }) => orderApi.addOrder(order)
        .catch((err) => {
          showErrorMessage(err, dispatch);
          throw err;
        }),
      {
      }
    ),
  }),
});

const orderSlice = makeOrderSlice();

export default orderSlice;

export const {
  addOrderAction
} = orderSlice.actions;
