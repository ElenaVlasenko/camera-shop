import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { showErrorMessage } from '../error-slice/error-slice';
import { Camera, Promo } from '../../types';
import { CamerasApi } from '../../api/cameras-api';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type CamerasState = {
  isCamerasLoading: boolean;
  cameras: Camera[];
  selectedCameraId: Camera['id'] | null;
  promo: Promo[];
}

export const initialState: CamerasState = {
  isCamerasLoading: false,
  cameras: [],
  selectedCameraId: null,
  promo: []
};

export const CAMERAS_SLICE_NAME = 'cameras';

const getCameras = (state: Pick<CamerasState, 'cameras'>) => state.cameras;
const getSelectedCameraId = (state: Pick<CamerasState, 'selectedCameraId'>) => state.selectedCameraId;
// const selectQuests = (state: Pick<CamerasState, 'quests'>) => state.quests;
// const selectCurrentTypeName = (state: Pick<CamerasState, 'selectedTypeName'>) => state.selectedTypeName;
// const selectCurrentLevelName = (state: Pick<CamerasState, 'selectedLevelName'>) => state.selectedLevelName;

const getCameraId = createSelector(
  [
    getCameras,
    getSelectedCameraId
  ],

  (cameras, selectedCameraId) => cameras.find((camera) => camera.id === selectedCameraId)
);
// const filteredQuests = createSelector(
//   [
//     selectQuests,
//     selectCurrentTypeName,
//     selectCurrentLevelName,
//   ],
//   (quests, selectedType, selectedLevel) => quests.filter((quest) =>
//     (selectedType === ALL_TYPES || quest.type === selectedType)
//     && (selectedLevel === ANY_LEVEL || quest.level === selectedLevel)
//   )
// );

const camerasSlice = createSliceWithThunks({
  name: CAMERAS_SLICE_NAME,
  initialState,
  selectors: {
    selectCameras: getCameras,
    selectSelectedCameraId: getCameraId,
    selectIsCamerasLoading: (state) => state.isCamerasLoading,
    selectPromo: (state) => state.promo,
    // selectSelectedType: selectCurrentTypeName,
    // selectSelectedLevel: selectCurrentLevelName,
    // selectSelectedQuests: selectQuests,
    // selectFilteredQuests: filteredQuests,
  },
  reducers: (create) => ({
    setselectSelectedCameraId: create.reducer<Camera['id']>((state, action) => {
      state.selectedCameraId = action.payload;
    }),
    // resetFilters: create.reducer((state) => {
    //   state.selectedLevelName = ANY_LEVEL;
    //   state.selectedTypeName = ALL_TYPES;
    // }),
    // setSelectedType: create.reducer<SelectedType>((state, action) => {
    //   const { payload: selectedType } = action;
    //   state.selectedTypeName = selectedType;
    // }),
    // setSelectedLevel: create.reducer<SelectedLevel>((state, action) => {
    //   const { payload: selectedLevel } = action;
    //   state.selectedLevelName = selectedLevel;
    // }),
    fetchCamerasAction: create.asyncThunk<Camera[], undefined, { extra: { camerasApi: CamerasApi } }>(
      async (_arg, { extra: { camerasApi }, dispatch }) => camerasApi.getList().catch((err) => {
        // showErrorMessage(err, dispatch);
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
        // showErrorMessage(err, dispatch);
        throw err;
      }),
      {
        pending: (state) => {
          // state.isCamerasLoading = true;
        },
        rejected: (state) => {
          // state.isCamerasLoading = false;
        },
        fulfilled: (state, action) => {
          // state.isCamerasLoading = false;
          const { payload: promo } = action;
          state.promo = promo;
        },
      }
    ),
  }),
});

export default camerasSlice;

export const {
  selectCameras,
  selectSelectedCameraId,
  selectIsCamerasLoading,
  selectPromo,
  // selectSelectedQuests,
  // selectSelectedType,
  // selectSelectedLevel,
  // selectFilteredQuests,
} = camerasSlice.selectors;

export const {

  fetchCamerasAction,
  setselectSelectedCameraId,
  fetchPromoAction,
  // setSelectedType,
  // setSelectedLevel,
  // resetFilters
} = camerasSlice.actions;
