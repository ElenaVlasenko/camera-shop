import { OrderApi } from '../../api/order-api';
import { createTestStore } from '../../test/store-utils';
import { generateOrder } from '../../test/test-data-generators';
import orderSlice, { addOrderAction, ORDER_SLICE_NAME } from './order-slice';

type Fakes = {
  orderApi: Partial<OrderApi>;
};

const createStore = (fakes: Fakes) => createTestStore(
  {
    [ORDER_SLICE_NAME]: orderSlice.reducer,
  },
  fakes,
);

describe('Order slice thunks test', () => {
  describe('addOrderAction thunk tests', () => {
    it('thunk forwards params to api', async () => {
      const order = generateOrder();
      let isApiHaveBeenCalled = false;

      const store = createStore({
        orderApi: {
          addOrder: async (pOrder) => {
            expect(pOrder).toEqual(order);
            isApiHaveBeenCalled = true;

            return Promise.resolve();
          }
        }
      });

      await store.dispatch(addOrderAction(order));

      expect(isApiHaveBeenCalled).toBe(true);
    });
  });
});
