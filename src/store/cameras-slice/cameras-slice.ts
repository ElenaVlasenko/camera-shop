import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { Camera, Promo } from '../../types';
import { CamerasApi } from '../../api/cameras-api';
import { showErrorMessage } from '../error-slice/error-slice';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type CamerasState = {
  isCamerasLoading: boolean;
  cameras: Camera[];
  selectedCameraId: Camera['id'] | null;
  promo: Promo[];
  similar: Camera[];
}

export const defaultState: CamerasState = {
  isCamerasLoading: false,
  cameras: [],
  selectedCameraId: null,
  promo: [],
  similar: [],
};

export const CAMERAS_SLICE_NAME = 'cameras';

export const makeCamerasSlice = (initialState: CamerasState) => createSliceWithThunks({
  name: CAMERAS_SLICE_NAME,
  initialState: initialState,
  selectors: {
    selectCameras: (state) => state.cameras,
    selectIsCamerasLoading: (state) => state.isCamerasLoading,
    selectPromo: (state) => state.promo,
    selectSimilar: (state) => state.similar,
  },
  reducers: (create) => ({
    setSelectedCameraId: create.reducer<Camera['id']>((state, action) => {
      state.selectedCameraId = action.payload;
    }),
    fetchCamerasAction: create.asyncThunk<Camera[], undefined, { extra: { camerasApi: CamerasApi } }>(
      async (_arg, { extra: { camerasApi }, dispatch }) => camerasApi.getList().catch((err) => {
        showErrorMessage(err, dispatch);
        throw err;
      }),
      {
        pending: (state) => {
          state.isCamerasLoading = true;
        },
        rejected: (state) => {
          state.isCamerasLoading = false;
        },
        fulfilled: (state, action) => {
          state.isCamerasLoading = false;
          const { payload: cameras } = action;
          state.cameras = cameras;
        },
      }
    ),
    fetchPromoAction: create.asyncThunk<Promo[], undefined, { extra: { camerasApi: CamerasApi } }>(
      async (_arg, { extra: { camerasApi }, dispatch }) => camerasApi.getPromo().catch((err) => {
        showErrorMessage(err, dispatch);
        throw err;
      }),
      {
        fulfilled: (state, action) => {
          const { payload: promo } = action;
          state.promo = promo;
        },
      }
    ),
    fetchSimilarAction: create.asyncThunk<Camera[], number, { extra: { camerasApi: CamerasApi } }>(
      async (id, { extra: { camerasApi }, dispatch }) => camerasApi.getSimilar(id).catch((err) => {
        showErrorMessage(err, dispatch);
        throw err;
      }),
      {
        fulfilled: (state, action) => {
          const { payload: similar } = action;
          state.similar = similar;
        },
      }
    ),
  }),
});

const camerasSlice = makeCamerasSlice(defaultState);

export default camerasSlice;

export const {
  selectCameras,
  selectIsCamerasLoading,
  selectPromo,
  selectSimilar
} = camerasSlice.selectors;

export const {

  fetchCamerasAction,
  setSelectedCameraId,
  fetchPromoAction,
  fetchSimilarAction,
} = camerasSlice.actions;
