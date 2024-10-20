import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { showErrorMessage } from './error-slice';
import { isAxiosNotFoundError } from '../utils';
import { OrderParams } from '../../types';
import { OrderApi } from '../../api/order-api';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type OrderState = {
  // order: Order | null;
}

const initialState: OrderState = {
  // order: null,
};

export const ORDER_SLICE_NAME = 'order';

const orderSlice = createSliceWithThunks({
  name: ORDER_SLICE_NAME,
  initialState,
  selectors: {
  },
  reducers: (create) => ({
    addOrderAction: create.asyncThunk<void, OrderParams, { extra: { orderApi: OrderApi } }>(
      (order, { extra: { orderApi }, dispatch }) => orderApi.addOrder(order)
        // .then((res) => {
        //   onSuccess();
        //   return res;
        // })
        .catch((err) => {
          // showErrorMessage(err, dispatch);
          throw err;
        }),
      {
        // fulfilled: (state, action) => {
        // state.order = action.payload;
        // },
        // pending: (state) => {
        // },
        // rejected: (state) => {
        // }
      }
    ),
  }),
});

export default orderSlice;

export const {
} = orderSlice.selectors;

export const {
  addOrderAction
} = orderSlice.actions;
