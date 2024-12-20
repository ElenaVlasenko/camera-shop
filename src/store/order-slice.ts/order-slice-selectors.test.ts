import { generateCamera } from '../../test/test-data-generators';
import { makeList } from '../../test/utils';
import { defaultState, OrderState, selectCameras, selectCamerasCounts } from './order-slice';


describe.only('Order slice selectors tests', () => {
  it('selectCameras returns state.cameras', () => {
    const cameras = makeList(3, () => generateCamera());
    const state: OrderState = { ...defaultState, cameras };

    expect(selectCameras.unwrapped(state)).toEqual(cameras);
  });

  it('selectCamerasCounts returns state.cameras', () => {
    const camerasCounts: OrderState['camerasCounts'] = { 1: 1 };
    const state: OrderState = { ...defaultState, camerasCounts };

    expect(selectCamerasCounts.unwrapped(state)).toEqual(camerasCounts);
  });
});
