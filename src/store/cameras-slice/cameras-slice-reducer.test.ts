import { CATEGORY, LEVEL, SortingKey, SortingOrder, TYPE } from '../../const';
import slice, {
  CamerasState,
  defaultState,
  resetSearchText,
  setCategory,
  addLevel,
  setSearchText,
  setSelectedCameraId,
  setSortingKey,
  setSortingOrder,
  addType,
  removeLevel,
  removeType,
  setPriceMin,
  setPriceMax,
  resetCategory,
  resetPriceMin,
  resetPriceMax,
  setTypes,
  setLevels,
  resetFilters
} from './cameras-slice';

const makeState = (overrides: Partial<CamerasState> = {}): CamerasState => ({
  ...defaultState,
  ...overrides
});

describe('Cameras slice reducer tests', () => {
  it('setSelectedCameraId reducer sets state.selectedCameraId value', () => {
    const selectedCameraId = 1;
    const state = makeState();

    const action = setSelectedCameraId(selectedCameraId);
    const newState = slice.reducer(state, action);

    expect(newState.selectedCameraId).toBe(selectedCameraId);
  });

  it('setSelectedCameraId reducer sets state.searchText value', () => {
    const searchText = 'qwe';
    const state = makeState();

    const action = setSearchText(searchText);
    const newState = slice.reducer(state, action);

    expect(newState.searchText).toBe(searchText);
  });

  it('resetSearchText reducer resets state.searchText value', () => {
    const state = makeState();

    const newState = slice.reducer(state, resetSearchText());

    expect(newState.searchText).toBe('');
  });

  it('setSortingKey reducer sets state.sortingKey value', () => {
    for (const sortingKey of Object.values(SortingKey)) {
      const state = makeState();

      const action = setSortingKey(sortingKey);
      const newState = slice.reducer(state, action);

      expect(newState.sortingKey).toBe(sortingKey);
    }
  });

  it('setSortingOrder reducer sets state.sortingOrder value', () => {
    for (const sortingOrder of Object.values(SortingOrder)) {
      const state = makeState();

      const action = setSortingOrder(sortingOrder);
      const newState = slice.reducer(state, action);

      expect(newState.sortingOrder).toBe(sortingOrder);
    }
  });

  it('setCategory reducer sets state.category value', () => {
    for (const category of Object.values(CATEGORY)) {
      const state = makeState();

      const action = setCategory(category);
      const newState = slice.reducer(state, action);

      expect(newState.category).toBe(category);
    }
  });

  it('resetCategory reducer resets state.category', () => {
    const state = makeState({ category: CATEGORY.PHOTO });

    const action = resetCategory();
    const newState = slice.reducer(state, action);

    expect(newState.category).toBe(defaultState.category);
  });

  it('addLevel reducer adds value to state.levels', () => {
    const state = makeState();
    const level = LEVEL.NON_PROFESSIONAL;

    const action = addLevel(level);
    const newState = slice.reducer(state, action);

    expect(newState.levels).toEqual([level]);
  });

  it('removeLevel reducer removes value from state.levels', () => {
    const state = makeState({ levels: [LEVEL.NON_PROFESSIONAL, LEVEL.PROFESSIONAL] });
    const removedLevel = LEVEL.PROFESSIONAL;

    const action = removeLevel(removedLevel);
    const newState = slice.reducer(state, action);

    expect(newState.levels).toEqual([LEVEL.NON_PROFESSIONAL]);
  });

  it('addType reducer adds value to state.types', () => {
    const state = makeState();
    const cameraType = TYPE.COLLECTION;

    const action = addType(cameraType);
    const newState = slice.reducer(state, action);

    expect(newState.types).toEqual([cameraType]);
  });

  it('removeType reducer removes value from state.types', () => {
    const state = makeState({ types: [TYPE.COLLECTION, TYPE.DIGITAL] });
    const removedType = TYPE.DIGITAL;

    const action = removeType(removedType);
    const newState = slice.reducer(state, action);

    expect(newState.types).toEqual([TYPE.COLLECTION]);
  });

  it('setPriceMin reducer sets value to state.priceMin', () => {
    const state = makeState();
    const priceMin = 1000;

    const action = setPriceMin(priceMin);
    const newState = slice.reducer(state, action);

    expect(newState.priceMin).toBe(priceMin);
  });

  it('resetPriceMin reducer sets value to state.priceMin', () => {
    const state = makeState({ priceMin: 1000 });

    const action = resetPriceMin();
    const newState = slice.reducer(state, action);

    expect(newState.priceMin).toBe(defaultState.priceMin);
  });

  it('setPriceMax reducer sets value to state.priceMax', () => {
    const state = makeState();
    const priceMax = 1000;

    const action = setPriceMax(priceMax);
    const newState = slice.reducer(state, action);

    expect(newState.priceMax).toBe(priceMax);
  });

  it('resetPriceMax reducer sets value to state.priceMax', () => {
    const state = makeState({ priceMax: 1000 });

    const action = resetPriceMax();
    const newState = slice.reducer(state, action);

    expect(newState.priceMax).toBe(defaultState.priceMax);
  });

  it('setSortingKey reducer sets value to state.sortingKey', () => {
    for (const sortingKey of Object.values(SortingKey)) {
      const state = makeState();

      const action = setSortingKey(sortingKey);
      const newState = slice.reducer(state, action);

      expect(newState.sortingKey).toBe(sortingKey);
    }
  });

  it('setSortingOrder reducer sets value to state.sortingOrder', () => {
    for (const sortingOrder of Object.values(SortingOrder)) {
      const state = makeState();

      const action = setSortingOrder(sortingOrder);
      const newState = slice.reducer(state, action);

      expect(newState.sortingOrder).toBe(sortingOrder);
    }
  });

  it('setTypes reducer sets value to state.types', () => {
    const state = makeState();
    const types = [TYPE.COLLECTION, TYPE.DIGITAL];

    const action = setTypes(types);
    const newState = slice.reducer(state, action);

    expect(newState.types).toEqual(types);
  });

  it('setLevels reducer sets value to state.levels', () => {
    const state = makeState();
    const levels = [LEVEL.NON_PROFESSIONAL, LEVEL.PROFESSIONAL];

    const action = setLevels(levels);
    const newState = slice.reducer(state, action);

    expect(newState.levels).toEqual(levels);
  });

  it('resetFilters reducer resets all filters', () => {
    const state = makeState({
      category: CATEGORY.PHOTO,
      types: [TYPE.COLLECTION, TYPE.DIGITAL],
      levels: [LEVEL.NON_PROFESSIONAL, LEVEL.PROFESSIONAL],
      priceMin: 1000,
      priceMax: 5000
    });

    const action = resetFilters();

    const newState = slice.reducer(state, action);
    expect(newState.category).toBe(defaultState.category);
    expect(newState.types).toEqual(defaultState.types);
    expect(newState.levels).toEqual(defaultState.levels);
    expect(newState.priceMin).toBe(defaultState.priceMin);
    expect(newState.priceMax).toBe(defaultState.priceMax);
  });
});
