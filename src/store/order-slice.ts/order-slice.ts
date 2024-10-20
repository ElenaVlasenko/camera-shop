import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { OrderParams } from '../../types';
import { OrderApi } from '../../api/order-api';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type OrderState = {
  // order: Order | null;
}

export const defaultState: OrderState = {
  // order: null,
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

const orderSlice = makeOrderSlice();

export default orderSlice;

export const {
  addOrderAction
} = orderSlice.actions;
