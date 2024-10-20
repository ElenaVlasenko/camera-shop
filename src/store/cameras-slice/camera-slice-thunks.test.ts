import { CamerasApi } from '../../api/cameras-api';
import { createTestStore } from '../../test/store-utils';
import { generateCamera } from '../../test/test-data-generators';
import { makeList } from '../../test/utils';
import camerasSlice, { CAMERAS_SLICE_NAME, fetchCamerasAction, fetchPromoAction, fetchSimilarAction } from './cameras-slice';

type Fakes = {
  camerasApi: Partial<CamerasApi>;
};

const createStore = (fakes: Fakes) => createTestStore(
  {
    [CAMERAS_SLICE_NAME]: camerasSlice.reducer,
  },
  fakes,
);

type Store = ReturnType<typeof createTestStore>;

const getState = (store: Store) => store.getState()[CAMERAS_SLICE_NAME];

describe('Review slice thunks test', () => {
  describe('fetchCamerasAction thunk tests', () => {
    it('thunk switches isCamerasLoading flag and sets gotten cameras to state', async () => {
      const cameras = makeList(10, () => generateCamera());

      const store = createStore({
        camerasApi: {
          getList: () => Promise.resolve(cameras)
        }
      });

      const thunkPromise = store.dispatch(fetchCamerasAction());

      expect(getState(store).isCamerasLoading).toEqual(true);

      await thunkPromise;

      const state = getState(store);
      expect(state.isCamerasLoading).toEqual(false);
      expect(state.cameras).toEqual(cameras);
    });

    it('isCamerasLoading have been set to false on thunk fail', async () => {
      const store = createStore({
        camerasApi: {
          getList: () => {
            throw new Error();
          }
        }
      });

      const thunkPromise = store.dispatch(fetchCamerasAction());

      expect(getState(store).isCamerasLoading).toEqual(true);

      await thunkPromise;

      expect(getState(store).isCamerasLoading).toEqual(false);
    });
  });

  describe('fetchPromoAction thunk tests', () => {
    it('thunk sets gotten promo cameras to state', async () => {
      const promoCameras = makeList(10, () => generateCamera());

      const store = createStore({
        camerasApi: {
          getPromo: () => Promise.resolve(promoCameras)
        }
      });

      await store.dispatch(fetchPromoAction());

      expect(getState(store).promo).toEqual(promoCameras);
    });
  });

  describe('fetchSimilarAction thunk tests', () => {
    it('thunk sets gotten similar cameras to state', async () => {
      const cameraId = 1;
      const similarCameras = makeList(10, () => generateCamera());

      const store = createStore({
        camerasApi: {
          getSimilar: (id) => {
            expect(id).toEqual(cameraId);
            return Promise.resolve(similarCameras);
          }
        }
      });

      await store.dispatch(fetchSimilarAction(cameraId));

      expect(getState(store).similar).toEqual(similarCameras);
    });
  });
});
