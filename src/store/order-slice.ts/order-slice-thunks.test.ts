import { CouponApi } from '../../api/coupon-api';
import { OrderApi } from '../../api/order-api';
import { REQUEST_STATUS } from '../../const';
import { createTestStore } from '../../test/store-utils';
import { generateCamera } from '../../test/test-data-generators';
import { addOrder, makeOrderSlice, ORDER_SLICE_NAME, OrderState, defaultState, checkCoupon } from './order-slice';

type Fakes = {
  orderApi?: Partial<OrderApi>;
  couponApi?: Partial<CouponApi>;
};

const createStore = (fakes: Fakes, state: Partial<OrderState> = {}) => createTestStore(
  {
    [ORDER_SLICE_NAME]: makeOrderSlice({ ...defaultState, ...state }).reducer,
  },
  fakes,
);

describe('Order slice thunks test', () => {
  describe('addOrderAction thunk tests', () => {
    it('SUT forwards params to api', async () => {
      const camera = generateCamera();
      let isApiHaveBeenCalled = false;

      const store = createStore(
        {
          orderApi: {
            addOrder: async (pOrder) => {
              expect(pOrder.camerasIds).toEqual([camera.id]);
              expect(pOrder.coupon).toBe(null);
              isApiHaveBeenCalled = true;

              return Promise.resolve();
            }
          }
        },
        {
          cameras: [camera],
          camerasCounts: { [camera.id]: 1 }
        }
      );

      await store.dispatch(addOrder({ coupon: null }));

      expect(isApiHaveBeenCalled).toBe(true);
    });

    it('when SUT move through pending to resolved, state.orderRequestStatus move through in-progress to success', async () => {
      const store = createStore({
        orderApi: {
          addOrder: async () => Promise.resolve(),
        }
      });

      const thunkPromise = store.dispatch(addOrder({ coupon: null }));

      { // pending
        const requestStatus = store.getState().order?.orderRequestStatus;
        expect(requestStatus).toBe(REQUEST_STATUS.IN_PROGRESS);
      }

      await thunkPromise;

      { // resolved
        const requestStatus = store.getState().order?.orderRequestStatus;
        expect(requestStatus).toBe(REQUEST_STATUS.SUCCESS);
      }
    });

    it('when SUT is rejected, state.orderRequestStatus is failed', async () => {
      const camera = generateCamera();

      const store = createStore(
        {
          orderApi: {
            addOrder: async () => Promise.reject(),
          }
        },
        {
          cameras: [camera],
          camerasCounts: { [camera.id]: 1 }
        }
      );

      await store.dispatch(addOrder({ coupon: null }));

      const requestStatus = store.getState().order?.orderRequestStatus;
      expect(requestStatus).toBe(REQUEST_STATUS.FAILED);
    });
  });

  describe('checkCoupon thunk tests', () => {
    it('SUT forwards params to api', async () => {
      const coupon = 'some coupone';
      const discount = 10;

      const store = createStore({
        couponApi: {
          check: async (pCoupon) => {
            expect(pCoupon).toEqual(coupon);
            return Promise.resolve(discount);
          }
        }
      });

      await store.dispatch(checkCoupon(coupon));

      expect(store.getState().order?.couponDiscount).toBe(discount);
    });

    it('when SUT move through pending to resolved, state.couponRequestStatus move through in-progress to success', async () => {
      const coupon = 'some coupone';
      const discount = 10;

      const store = createStore({
        couponApi: {
          check: async () => Promise.resolve(discount)
        }
      });

      const thunkPromise = store.dispatch(checkCoupon(coupon));

      { // pending
        const requestStatus = store.getState().order?.couponRequestStatus;
        expect(requestStatus).toBe(REQUEST_STATUS.IN_PROGRESS);
      }

      await thunkPromise;

      { // resolved
        const requestStatus = store.getState().order?.couponRequestStatus;
        expect(requestStatus).toBe(REQUEST_STATUS.SUCCESS);
      }
    });

    it('when SUT is rejected, state.orderRequestStatus is failed', async () => {
      const store = createStore(
        {
          couponApi: {
            check: async () => Promise.reject()
          }
        },
      );

      await store.dispatch(checkCoupon('some coupon'));

      const requestStatus = store.getState().order?.couponRequestStatus;
      expect(requestStatus).toBe(REQUEST_STATUS.FAILED);
    });
  });
});
