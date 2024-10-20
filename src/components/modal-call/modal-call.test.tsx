import { render } from '@testing-library/react';
import { Action, Middleware } from '@reduxjs/toolkit';
import { createTestStore } from '../../test/store-utils';
import { withStore } from '../../test/pages-utils';
import { clickTo, typeTo } from '../../test/utils';
import { MODAL_FORM_SUBMIT_BUTTON_ID, TEL_INPUT_ID } from '../../components/modal-call/utils';
import orderSlice, { makeOrderSlice, defaultState, ORDER_SLICE_NAME } from '../../store/order-slice.ts/order-slice';
import ModalCall from './modal-call';
import { generateCamera } from '../../test/test-data-generators';
import { OrderParams } from '../../types';

const cameraId = 1;

const createPageStore = (
  middleware?: Middleware,
  slice: typeof orderSlice = makeOrderSlice(defaultState),
) => createTestStore(
  { [ORDER_SLICE_NAME]: slice.reducer },
  {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    orderApi: {
      addOrder: () => Promise.resolve()
    }
  },
  middleware
);

const createSut = (middleware?: Middleware) => withStore(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <ModalCall camera={generateCamera({ id: cameraId })} onCloseButtonClick={() => { }} />,
  createPageStore(middleware)
);

const renderSut = (middleware?: Middleware) => {
  const sut = createSut(middleware);

  render(sut);
};

const typeToTelInput = typeTo(TEL_INPUT_ID);
const clickSubmitButton = clickTo(MODAL_FORM_SUBMIT_BUTTON_ID);

type AddOrderAction = (Action<string> & { payload?: unknown; meta: { arg: OrderParams } });

describe('Camera Modal tests', () => {
  it('correct order params were forwarded to thunk', async () => {
    const actions: AddOrderAction[] = [];

    const actionInterceptor = (() => (next) => (action: AddOrderAction) => {
      actions.push(action);
      return next(action);
    }) as Middleware;

    renderSut(actionInterceptor);
    const correctTelValue = '+79999999999';

    await typeToTelInput(correctTelValue);
    await clickSubmitButton();

    const expectedArg = { camerasIds: [cameraId], coupon: null, tel: correctTelValue };
    expect(actions.at(0)?.type).toBe('order/addOrderAction/pending');
    expect(actions.at(0)?.meta.arg).toEqual(expectedArg);
    expect(actions.at(1)?.type).toBe('order/addOrderAction/fulfilled');
    expect(actions.at(1)?.meta.arg).toEqual(expectedArg);
  });
});
