import { buildCreateSlice, asyncThunkCreator, createSelector } from '@reduxjs/toolkit';
import { Camera, Promo } from '../../types';
import { CamerasApi } from '../../api/cameras-api';
import { showErrorMessage } from '../error-slice/error-slice';
import { CATEGORY, Category, Level, SortingKey, SortingOrder, TYPE, Type } from '../../const';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type CamerasState = {
  isCamerasLoading: boolean;
  cameras: Camera[];
  selectedCameraId: Camera['id'] | null;
  promo: Promo[];
  similar: Camera[];
  searchText: string;
  sortingKey: SortingKey;
  sortingOrder: SortingOrder;
  priceMin: number;
  priceMax: number;
  types: Type[];
  category: Category | null;
  levels: Level[];
}

export const defaultState: CamerasState = {
  isCamerasLoading: false,
  cameras: [],
  selectedCameraId: null,
  promo: [],
  similar: [],
  searchText: '',
  sortingKey: SortingKey.Price,
  sortingOrder: SortingOrder.ASC,
  priceMin: 0,
  priceMax: Infinity,
  types: [],
  category: null,
  levels: [],
};

export const CAMERAS_SLICE_NAME = 'cameras';
const MIN_SEARCH_TEXT_LENGTH = 3;

const makeSorter = (sortingKey: SortingKey, sortingOrder: SortingOrder) => (c1: Camera, c2: Camera) => sortingOrder === SortingOrder.ASC ? c1[sortingKey] - c2[sortingKey] : c2[sortingKey] - c1[sortingKey];

const getSearchText = (state: Pick<CamerasState, 'searchText'>) => state.searchText;
const getCameras = (state: Pick<CamerasState, 'cameras'>) => state.cameras;
const getSortingOrder = (state: Pick<CamerasState, 'sortingOrder'>) => state.sortingOrder;
const getSortingKey = (state: Pick<CamerasState, 'sortingKey'>) => state.sortingKey;
const getCategory = (state: Pick<CamerasState, 'category'>) => state.category;
const getTypes = (state: Pick<CamerasState, 'types'>) => state.types;
const getLevel = (state: Pick<CamerasState, 'levels'>) => state.levels;
const getPriceMin = (state: Pick<CamerasState, 'priceMin'>) => state.priceMin;
const getPriceMax = (state: Pick<CamerasState, 'priceMax'>) => state.priceMax;

const hasCategory = (category: Category | null) => (camera: Camera) => category === null ? true : camera.category === category;
const hasType = (types: Type[]) => (camera: Camera) => types.length === 0 ? true : types.includes(camera.type);
const hasLevel = (levels: Level[]) => (camera: Camera) => levels.length === 0 ? true : levels.includes(camera.level);
const hasPrice = (priceMin: number, priceMax: number) => (camera: Camera) => camera.price >= priceMin && camera.price <= priceMax;

const and = (...predicates: ((camera: Camera) => boolean)[]) => (camera: Camera) => predicates.every((predicate) => predicate(camera));

const filteredCamerasBySearchText = createSelector(
  [
    getSearchText,
    getCameras
  ],
  (searchText, cameras) => searchText.length < MIN_SEARCH_TEXT_LENGTH ? [] : cameras.filter((camera) => camera.name.toLowerCase().includes(searchText.toLowerCase()))
);

const getDisplayedCameras = createSelector(
  [
    getCameras,
    getSortingOrder,
    getSortingKey,
    getCategory,
    getTypes,
    getLevel,
    getPriceMin,
    getPriceMax
  ],
  (cameras, sortingOrder, sortingKey, category, type, level, priceMin, priceMax) => cameras
    .filter(
      and(
        hasCategory(category),
        hasType(type),
        hasLevel(level),
        hasPrice(priceMin, priceMax)
      )
    )
    .sort(makeSorter(sortingKey, sortingOrder))
);

const getDisplayedCamerasWithoutPriceFilter = createSelector(
  [
    getCameras,
    getSortingOrder,
    getSortingKey,
    getCategory,
    getTypes,
    getLevel,
  ],
  (cameras, sortingOrder, sortingKey, category, type, level) => cameras
    .filter(
      and(
        hasCategory(category),
        hasType(type),
        hasLevel(level),
      )
    )
    .sort(makeSorter(sortingKey, sortingOrder))
);

export const makeCamerasSlice = (initialState: CamerasState) => createSliceWithThunks({
  name: CAMERAS_SLICE_NAME,
  initialState: initialState,
  selectors: {
    selectCameras: getCameras,
    selectIsCamerasLoading: (state) => state.isCamerasLoading,
    selectPromo: (state) => state.promo,
    selectSimilar: (state) => state.similar,
    selectSortingOrder: (state) => state.sortingOrder,
    selectSortingKey: (state) => state.sortingKey,
    selectFilteredCamerasBySearchText: filteredCamerasBySearchText,
    selectSearchText: getSearchText,
    selectDisplayedCameras: getDisplayedCameras,
    selectDisplayedCamerasWithoutPriceFilter: getDisplayedCamerasWithoutPriceFilter,
    selectCategory: getCategory,
    selectTypes: getTypes,
    selectLevels: getLevel,
    selectPriceMin: getPriceMin,
    selectPriceMax: getPriceMax
  },
  reducers: (create) => ({
    setSelectedCameraId: create.reducer<Camera['id']>((state, action) => {
      state.selectedCameraId = action.payload;
    }),
    setSearchText: create.reducer<string>((state, action) => {
      state.searchText = action.payload;
    }),
    resetSearchText: create.reducer((state) => {
      state.searchText = '';
    }),
    setSortingKey: create.reducer<SortingKey>((state, action) => {
      state.sortingKey = action.payload;
    }),
    setCategory: create.reducer<Category>((state, action) => {
      state.category = action.payload;

      if (action.payload === CATEGORY.VIDEO) {
        state.types = state.types.filter((cameraType) => !([TYPE.FILM, TYPE.SNAPSHOT] as Type[]).includes(cameraType));
      }
    }),
    resetCategory: create.reducer((state) => {
      state.category = null;
    }),
    addType: create.reducer<Type>((state, action) => {
      state.types = [...new Set([...state.types, action.payload])];
    }),
    removeType: create.reducer<Type>((state, action) => {
      state.types = state.types.filter((cameraType) => cameraType !== action.payload);
    }),
    setTypes: create.reducer<Type[]>((state, action) => {
      state.types = [...new Set(action.payload)];
    }),
    addLevel: create.reducer<Level>((state, action) => {
      state.levels = [...new Set([...state.levels, action.payload])];
    }),
    setLevels: create.reducer<Level[]>((state, action) => {
      state.levels = [...new Set(action.payload)];
    }),
    removeLevel: create.reducer<Level>((state, action) => {
      state.levels = state.levels.filter((level) => level !== action.payload);
    }),
    setPriceMin: create.reducer<number>((state, action) => {
      state.priceMin = action.payload;
    }),
    resetPriceMin: create.reducer((state) => {
      state.priceMin = 0;
    }),
    setPriceMax: create.reducer<number>((state, action) => {
      state.priceMax = action.payload;
    }),
    resetPriceMax: create.reducer((state) => {
      state.priceMax = Infinity;
    }),
    setSortingOrder: create.reducer<SortingOrder>((state, action) => {
      state.sortingOrder = action.payload;
    }),
    resetFilters: create.reducer((state) => {
      state.types = [];
      state.category = null;
      state.levels = [];
      state.priceMax = Infinity;
      state.priceMin = 0;
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
  selectSimilar,
  selectFilteredCamerasBySearchText,
  selectSearchText,
  selectDisplayedCameras,
  selectDisplayedCamerasWithoutPriceFilter,
  selectCategory,
  selectTypes,
  selectLevels,
  selectPriceMin,
  selectPriceMax,
  selectSortingOrder,
  selectSortingKey
} = camerasSlice.selectors;

export const {
  fetchCamerasAction,
  setSelectedCameraId,
  fetchPromoAction,
  fetchSimilarAction,
  setSearchText,
  resetSearchText,
  setSortingKey,
  setSortingOrder,
  setCategory,
  addType,
  addLevel,
  resetFilters,
  removeType,
  resetCategory,
  removeLevel,
  setPriceMax,
  setPriceMin,
  resetPriceMax,
  resetPriceMin,
  setTypes,
  setLevels
} = camerasSlice.actions;
