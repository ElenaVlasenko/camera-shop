import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { Camera, CameraCounts } from '../../types';
import { OrderApi } from '../../api/order-api';
import { BAD_REQUEST_ERROR_CODE, REQUEST_STATUS, RequestStatus } from '../../const';
import { getIdsOf } from '../../test/utils';
import { CouponApi } from '../../api/coupon-api';

export type OrderState = {
  cameras: Camera[];
  camerasCounts: CameraCounts;
  orderRequestStatus: null | RequestStatus;
  couponRequestStatus: null | RequestStatus;
  errorMessage: null | string;
  couponDiscount: number;
  isCouponValid: boolean | null;
}

type Cart = Pick<OrderState, 'cameras' | 'camerasCounts'>;

export const defaultCart: Cart = {
  cameras: [],
  camerasCounts: {},
};

export const defaultState: OrderState = {
  ...defaultCart,
  orderRequestStatus: null,
  couponRequestStatus: null,
  errorMessage: null,
  couponDiscount: 0,
  isCouponValid: null
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
    selectCartCameras: (state) => state.cameras,
    selectCamerasCounts: (state) => state.camerasCounts,
    selectOrderRequestStatus: (state) => state.orderRequestStatus,
    selectCouponRequestStatus: (state) => state.couponRequestStatus,
    selectIsCouponValid: (state) => state.isCouponValid,
    selectCouponDiscount: (state) => state.couponDiscount
  },
  reducers: (create) => ({
    addOrder: create.asyncThunk<void, { coupon: string | null }, { extra: { orderApi: OrderApi } }>(
      ({ coupon }, { extra: { orderApi }, getState }) => {
        const state = (getState() as { [ORDER_SLICE_NAME]: OrderState })[ORDER_SLICE_NAME];

        if (state.cameras.length === 0) {
          return;
        }

        return orderApi.addOrder({ camerasIds: getIdsOf(state.cameras), coupon: coupon ?? null });
      },
      {
        pending: (state) => {
          state.orderRequestStatus = REQUEST_STATUS.IN_PROGRESS;
        },
        rejected: (state) => {
          state.orderRequestStatus = REQUEST_STATUS.FAILED;
        },
        fulfilled: (state) => {
          state.orderRequestStatus = REQUEST_STATUS.SUCCESS;
          state.cameras = [];
          state.camerasCounts = {};
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          state.isCouponValid = null;
          state.couponRequestStatus = null;
        },
      }
    ),

    checkCoupon: create.asyncThunk<number, string, { extra: { couponApi: CouponApi } }>(
      (coupon, { extra: { couponApi } }) => couponApi.check(coupon),
      {
        pending: (state) => {
          state.couponRequestStatus = REQUEST_STATUS.IN_PROGRESS;
          state.couponDiscount = 0;
        },
        rejected: (state, action) => {
          state.couponRequestStatus = REQUEST_STATUS.FAILED;

          if (BAD_REQUEST_ERROR_CODE === action.error.code) {
            state.isCouponValid = false;
          }
        },
        fulfilled: (state, action) => {
          state.couponRequestStatus = REQUEST_STATUS.SUCCESS;
          state.couponDiscount = action.payload;
          state.isCouponValid = true;
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
  addOrder,
  addCameraToCart,
  setCamerasCount,
  removeCameraFromCart,
  resetOrderStatus,
  checkCoupon
} = orderSlice.actions;

export const {
  selectCartCameras,
  selectCamerasCounts,
  selectOrderRequestStatus,
  selectCouponDiscount,
  selectCouponRequestStatus,
  selectIsCouponValid
} = orderSlice.selectors;

