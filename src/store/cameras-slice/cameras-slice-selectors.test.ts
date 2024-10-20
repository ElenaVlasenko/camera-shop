import { generateCamera } from '../../test/test-data-generators';
import { makeList } from '../../test/utils';
import { CamerasState, defaultState, selectCameras, selectIsCamerasLoading, selectPromo, selectSimilar } from './cameras-slice';

describe('Camera slice selectors tests', () => {
  it('selectCameras returns state.cameras', () => {
    const cameras = makeList(3, () => generateCamera());
    const state: CamerasState = { ...defaultState, cameras };

    expect(selectCameras.unwrapped(state)).toEqual(cameras);
  });

  it('selectPromo returns state.promo', () => {
    const promo = makeList(3, () => generateCamera());
    const state: CamerasState = { ...defaultState, promo };

    expect(selectPromo.unwrapped(state)).toEqual(promo);
  });

  it('selectSimilar returns state.similar', () => {
    const similar = makeList(3, () => generateCamera());
    const state: CamerasState = { ...defaultState, similar };

    expect(selectSimilar.unwrapped(state)).toEqual(similar);
  });

  it('selectIsCamerasLoading returns state.isCamerasLoading', () => {
    const isCamerasLoading = true;
    const state: CamerasState = { ...defaultState, isCamerasLoading };

    expect(selectIsCamerasLoading.unwrapped(state)).toEqual(isCamerasLoading);
  });
});
