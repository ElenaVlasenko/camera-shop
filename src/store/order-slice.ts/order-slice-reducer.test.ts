import { REQUEST_STATUS } from '../../const';
import { generateCamera } from '../../test/test-data-generators';
import { getIdsOf, makeList } from '../../test/utils';
import slice, { OrderState, addCameraToCart, defaultState, removeCameraFromCart, resetOrderStatus, setCamerasCount } from './order-slice';

const makeState = (overrides: Partial<OrderState> = {}): OrderState => ({
  ...defaultState,
  ...overrides
});

describe('Order slice reducer tests', () => {
  it('addCameraToCart reducer increments camerasCounts', () => {
    const state = makeState();
    const camera = generateCamera();

    const action = addCameraToCart(camera);
    const newState = slice.reducer(state, action);

    const expectedCount = 1;
    expect(newState.camerasCounts[camera.id]).toBe(expectedCount);
  });

  it('addCameraToCart reducer adds camera to state.cameras', () => {
    const state = makeState();
    const camera = generateCamera();

    const action = addCameraToCart(camera);
    const newState = slice.reducer(state, action);

    expect(newState.cameras.includes(camera));
  });

  it('setCamerasCount reducer sets cameras count', () => {
    const state = makeState();
    const id = 123;
    const count = 5;

    const action = setCamerasCount({ id, count });
    const newState = slice.reducer(state, action);

    expect(newState.camerasCounts[id]).toBe(count);
  });

  it('setCamerasCount reducer set count to 1 when action contains value less than 1', () => {
    const camera = generateCamera();
    const state = makeState({ cameras: [camera] });

    const action = setCamerasCount({ id: camera.id, count: 0 });
    const newState = slice.reducer(state, action);

    expect(newState.camerasCounts[camera.id]).toEqual(1);
  });

  it('setCamerasCount reducer set count to 9 when action contains value grater than 9', () => {
    const camera = generateCamera();
    const state = makeState({ cameras: [camera] });

    const action = setCamerasCount({ id: camera.id, count: 10 });
    const newState = slice.reducer(state, action);

    expect(newState.camerasCounts[camera.id]).toEqual(9);
  });

  it('removeCameraFromCart reducer removes camera from state.cameras', () => {
    const cameras = makeList(3, () => generateCamera());
    const camerasCount = 3;
    const state = makeState({
      cameras,
      camerasCounts: cameras.reduce(
        (acc, camera) => {
          acc[camera.id] = camerasCount;
          return acc;
        },
        {} as OrderState['camerasCounts']
      )
    });

    const subjectCamera = cameras[0];
    const action = removeCameraFromCart(subjectCamera.id);
    const newState = slice.reducer(state, action);
    const camerasIds = getIdsOf(newState.cameras);

    expect(camerasIds.includes(subjectCamera.id)).toBe(false);
    expect(newState.camerasCounts[subjectCamera.id]).toBe(0);
  });

  it('resetOrderStatus reducer set orderRequestStatus to null', () => {
    const state = makeState({ orderRequestStatus: REQUEST_STATUS.SUCCESS });

    const newState = slice.reducer(state, resetOrderStatus());

    expect(newState.orderRequestStatus).toEqual(null);
  });
});
