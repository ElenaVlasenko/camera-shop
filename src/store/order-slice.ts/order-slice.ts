import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { Camera, CameraCounts } from '../../types';
import { OrderApi } from '../../api/order-api';
import { showErrorMessage } from '../error-slice/error-slice';
import { ORDER_REQUEST_STATUS, OrderRequestStatus } from '../../const';
import { getIdsOf } from '../../test/utils';

export type OrderState = {
  cameras: Camera[];
  camerasCounts: CameraCounts;
  orderRequestStatus: null | OrderRequestStatus;
}

type Cart = Pick<OrderState, 'cameras' | 'camerasCounts'>;

export const defaultCart: Cart = {
  cameras: [],
  camerasCounts: {},
};

export const defaultState: OrderState = {
  ...defaultCart,
  orderRequestStatus: null
};

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const LOCAL_STORAGE_KEY = 'cart';

const saveCartToLocalStorage = ({ cameras, camerasCounts }: Cart) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ cameras, camerasCounts }));
};

const getInitialState = (): OrderState => {
  const cartJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  const storageCart = cartJson === null ? defaultCart : JSON.parse(cartJson) as Cart;

  return {
    ...defaultState,
    ...storageCart
  };
};

export const ORDER_SLICE_NAME = 'order';

export const makeOrderSlice = (initialState = getInitialState()) => createSliceWithThunks({
  name: ORDER_SLICE_NAME,
  initialState,
  selectors: {
    selectCameras: (state) => state.cameras,
    selectCamerasCounts: (state) => state.camerasCounts,
    selectOrderRequestStatus: (state) => state.orderRequestStatus,
  },
  reducers: (create) => ({
    addOrderAction: create.asyncThunk<void, { coupon: string | null }, { extra: { orderApi: OrderApi } }>(
      ({ coupon }, { extra: { orderApi }, dispatch, getState }) => {
        const state = (getState() as { [ORDER_SLICE_NAME]: OrderState })[ORDER_SLICE_NAME];

        if (state.cameras.length === 0) {
          return;
        }

        return orderApi.addOrder({ camerasIds: getIdsOf(state.cameras), coupon: coupon ?? null })
          .catch((err) => {
            showErrorMessage(err, dispatch);
            throw err;
          });
      },
      {
        pending: (state) => {
          state.orderRequestStatus = ORDER_REQUEST_STATUS.IN_PROGRESS;
        },
        rejected: (state) => {
          state.orderRequestStatus = ORDER_REQUEST_STATUS.FAILED;
        },
        fulfilled: (state) => {
          state.orderRequestStatus = ORDER_REQUEST_STATUS.SUCCESS;
          state.cameras = [];
          state.camerasCounts = {};
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        },
      }
    ),

    addCameraToCart: create.reducer<Camera>((state, action) => {
      const camera = action.payload;
      const currentCount = state.camerasCounts[camera.id] ?? 0;

      if (currentCount === 0) {
        state.cameras = [...state.cameras, camera];
      }

      state.camerasCounts[camera.id] = currentCount + 1;
      saveCartToLocalStorage(state);
    }),

    setCamerasCount: create.reducer<{ id: Camera['id']; count: number }>((state, action) => {
      const { id, count } = action.payload;
      const newCount = count > 9 ? 9 : Math.max(count, 1);
      state.camerasCounts[id] = newCount;
      saveCartToLocalStorage(state);
    }),

    removeCameraFromCart: create.reducer<Camera['id']>((state, action) => {
      const cameraId = action.payload;
      state.camerasCounts[cameraId] = 0;
      state.cameras = state.cameras.filter((stateCamera) => cameraId !== stateCamera.id);
      saveCartToLocalStorage(state);
    }),

    resetOrderStatus: create.reducer((state) => {
      state.orderRequestStatus = null;
    })
  }),
});

const orderSlice = makeOrderSlice();

export default orderSlice;

export const {
  addOrderAction,
  addCameraToCart,
  setCamerasCount,
  removeCameraFromCart,
  resetOrderStatus
} = orderSlice.actions;

export const {
  selectCameras,
  selectCamerasCounts,
  selectOrderRequestStatus
} = orderSlice.selectors;

