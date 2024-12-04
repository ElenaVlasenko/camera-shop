import { ChangeEvent, useState, useCallback, useEffect } from 'react';
import { CATEGORY, Category, LEVEL, Level, TYPE, Type } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  resetFilters,
  removeLevel,
  removeType,
  selectLevels,
  selectTypes,
  setCategory,
  addLevel,
  addType,
  selectPriceMin,
  setPriceMin,
  setPriceMax,
  selectDisplayedCamerasWithoutPriceFilter,
  selectPriceMax,
  selectCategory,
  setTypes,
  setLevels
} from '../../store/cameras-slice/cameras-slice';
import { debounce, isEmpty } from '../../utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { CATEGORY_FILTER_TEST_ID, LEVEL_FILTER_TEST_ID, TYPE_FILTER_TEST_ID } from './test-ids';

const PRICE_HANDLING_TIMEOUT = 1000;
const types = Object.values(TYPE);
const categories = Object.values(CATEGORY);
const levels = Object.values(LEVEL);

const isValidCategory = (category: string): category is Category => (categories as string[]).includes(category);
const isValidType = (cameraType: string): cameraType is Type => (types as string[]).includes(cameraType);
const isValidLevel = (level: string): level is Level => (levels as string[]).includes(level);

const URL_PARAMS = {
  CATEGORY: 'category',
  TYPE: 'type',
  LEVEL: 'level',
  PRICE_MIN: 'minPrice',
  PRICE_MAX: 'maxPrice',
} as const;

type Props = {
  onFilterChange: (urlParams: URLSearchParams) => void;
}

const photoOnlyTypes: Type[] = [TYPE.SNAPSHOT, TYPE.FILM];

const typeTestIds: Record<Type, string> = {
  [TYPE.COLLECTION]: TYPE_FILTER_TEST_ID.COLLECTION,
  [TYPE.DIGITAL]: TYPE_FILTER_TEST_ID.DIGITAL,
  [TYPE.FILM]: TYPE_FILTER_TEST_ID.FILM,
  [TYPE.SNAPSHOT]: TYPE_FILTER_TEST_ID.SNAPSHOT,
};

const getTypeTestId = (cameraType: Type): string => typeTestIds[cameraType];

const typeNames: Record<Type, string> = {
  [TYPE.COLLECTION]: 'Коллекционная',
  [TYPE.DIGITAL]: 'Цифровая',
  [TYPE.FILM]: 'Плёночная',
  [TYPE.SNAPSHOT]: 'Моментальная',
};

const getTypeName = (cameraType: Type): string => typeNames[cameraType];


function Filters({ onFilterChange }: Props): JSX.Element {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedTypes = useAppSelector(selectTypes);
  const selectedLevels = useAppSelector(selectLevels);
  const selectedPriceMin = useAppSelector(selectPriceMin);
  const selectedPriceMax = useAppSelector(selectPriceMax);
  const selectedCategory = useAppSelector(selectCategory);
  const cameras = useAppSelector(selectDisplayedCamerasWithoutPriceFilter);

  const prices = cameras.map((camera) => camera.price);
  const displayedCamerasMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const displayedCamerasMaxPrice = prices.length > 0 ? Math.max(...prices) : Infinity;

  const [priceMinValue, setMinPriceValue] = useState('');
  const [priceMaxValue, setMaxPriceValue] = useState('');

  const setNewParamsToUrl = useCallback(
    (urlParams: URLSearchParams) => navigate(`${location.pathname}?${urlParams.toString()}`),
    [location.pathname, navigate]
  );

  const setUrlTypes = useCallback((newTypes: Type[], urlParams = new URLSearchParams(location.search)) => {
    urlParams.delete(URL_PARAMS.TYPE);
    new Set(newTypes).forEach((item) => urlParams.append(URL_PARAMS.TYPE, item));
    setNewParamsToUrl(urlParams);
  }, [location.search, setNewParamsToUrl]);

  const setUrlLevels = useCallback((newLevels: Level[], urlParams = new URLSearchParams(location.search)) => {
    urlParams.delete(URL_PARAMS.LEVEL);
    new Set(newLevels).forEach((item) => urlParams.append(URL_PARAMS.LEVEL, item));
    setNewParamsToUrl(urlParams);
  }, [location.search, setNewParamsToUrl]);

  useEffect(
    () => {
      const urlParams = new URLSearchParams(location.search);
      const urlMinPrice = urlParams.get(URL_PARAMS.PRICE_MIN) ?? '';

      if (urlMinPrice !== '' && !isNaN(+urlMinPrice) && priceMinValue === '') {
        setMinPriceValue(urlMinPrice);
        urlParams.set(URL_PARAMS.PRICE_MIN, urlMinPrice);
        setNewParamsToUrl(urlParams);
      }

      const urlMaxPrice = urlParams.get(URL_PARAMS.PRICE_MAX) ?? '';

      if (urlMaxPrice !== '' && !isNaN(+urlMaxPrice) && priceMaxValue === '') {
        setMaxPriceValue(urlMaxPrice);
        urlParams.set(URL_PARAMS.PRICE_MAX, urlMaxPrice);
        setNewParamsToUrl(urlParams);
      }

      const urlCategory = urlParams.get(URL_PARAMS.CATEGORY) ?? '';

      if (selectedCategory === null && isValidCategory(urlCategory)) {
        dispatch(setCategory(urlCategory));
        urlParams.set(URL_PARAMS.CATEGORY, urlCategory);
        setNewParamsToUrl(urlParams);
      }

      const urlTypes = (urlParams.getAll(URL_PARAMS.TYPE) ?? []).filter(isValidType);

      if (!isEmpty(urlTypes) && isEmpty(selectedTypes)) {
        dispatch(setTypes(urlTypes));
        setUrlTypes(urlTypes, urlParams);
      }

      const urlLevels = (urlParams.getAll(URL_PARAMS.LEVEL) ?? []).filter(isValidLevel);

      if (!isEmpty(urlLevels) && isEmpty(selectedLevels)) {
        dispatch(setLevels(urlLevels));
        setUrlLevels(urlLevels, urlParams);
      }
    },
    [
      navigate,
      dispatch,
      selectedCategory,
      location.search,
      location.pathname,
      selectedLevels,
      selectedTypes,
      setUrlLevels,
      setUrlTypes,
      priceMaxValue,
      priceMinValue,
      setNewParamsToUrl
    ]
  );

  const makeCategoryOnChangeHandler = (category: Category) => () => {
    const urlParams = new URLSearchParams(location.search);
    dispatch(setCategory(category));
    urlParams.set(URL_PARAMS.CATEGORY, category);

    if (category === CATEGORY.VIDEO) {
      const newSelectedTypes = selectedTypes.filter((item) => !photoOnlyTypes.includes(item));
      dispatch(setTypes(newSelectedTypes));
      setUrlTypes(newSelectedTypes, urlParams);
    }

    setNewParamsToUrl(urlParams);
    onFilterChange(urlParams);
  };

  const makeTypeOnChangeHandler = (cameraType: Type) => () => {
    const urlParams = new URLSearchParams(location.search);

    if (selectedTypes.includes(cameraType)) {
      dispatch(removeType(cameraType));
      setUrlTypes(selectedTypes.filter((item) => item !== cameraType), urlParams);
      onFilterChange(urlParams);
    } else {
      dispatch(addType(cameraType));
      setUrlTypes([...selectedTypes, cameraType], urlParams);
      onFilterChange(urlParams);
    }
  };

  const makeLevelOnChangeHandler = (level: Level) => () => {
    const urlParams = new URLSearchParams(location.search);

    if (selectedLevels.includes(level)) {
      dispatch(removeLevel(level));
      setUrlLevels(selectedLevels.filter((item) => item !== level), urlParams);
      onFilterChange(urlParams);
    } else {
      dispatch(addLevel(level));
      setUrlLevels([...selectedLevels, level], urlParams);
      onFilterChange(urlParams);
    }
  };

  const handleResetButtonClick = () => {
    const urlParams = new URLSearchParams(location.search);
    Object.values(URL_PARAMS).forEach((paramName) => urlParams.delete(paramName));
    setNewParamsToUrl(urlParams);
    setMaxPriceValue('');
    setMinPriceValue('');
    dispatch(resetFilters());
    onFilterChange(urlParams);
  };

  const updatePriceMin = (newValue: number) => {
    const urlParams = new URLSearchParams(location.search);
    setMinPriceValue(newValue.toString());
    dispatch(setPriceMin(newValue));
    urlParams.set(URL_PARAMS.PRICE_MIN, newValue.toString());
    setNewParamsToUrl(urlParams);
    onFilterChange(urlParams);
  };

  const updatePriceMax = (newValue: number) => {
    const urlParams = new URLSearchParams(location.search);
    setMaxPriceValue(newValue.toString());
    dispatch(setPriceMax(newValue));
    urlParams.set(URL_PARAMS.PRICE_MAX, newValue.toString());
    setNewParamsToUrl(urlParams);
    onFilterChange(urlParams);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPriceMinHandler = useCallback(debounce(updatePriceMin, PRICE_HANDLING_TIMEOUT), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPriceMaxHandler = useCallback(debounce(updatePriceMax, PRICE_HANDLING_TIMEOUT), []);

  const handlePriceMinChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const value = evt.target.value ? parseInt(evt.target.value, 10) : 0;
    setMinPriceValue(value.toString());
    const newMinPriceValue = Math.max(value, displayedCamerasMinPrice);
    debouncedPriceMinHandler(newMinPriceValue);
  };

  const handlePriceMaxChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const value = evt.target.value ? parseInt(evt.target.value, 10) : 0;
    setMaxPriceValue(value.toString());
    const newPriceMaxInput = Math.max(Math.min(value, displayedCamerasMaxPrice), priceMinValue ? parseInt(priceMinValue, 10) : 0);
    debouncedPriceMaxHandler(newPriceMaxInput);
  };

  const makeTypeFilterElement = (cameraType: Type): JSX.Element => (
    <div key={cameraType} className="custom-checkbox catalog-filter__item" >
      <label>
        <input
          data-testid={getTypeTestId(cameraType)}
          onChange={makeTypeOnChangeHandler(cameraType)}
          type="checkbox"
          name="digital"
          checked={selectedTypes.includes(cameraType)}
        />
        <span className="custom-checkbox__icon" />
        <span className="custom-checkbox__label">{getTypeName(cameraType)}</span>
      </label>
    </div>
  );

  return (
    <div className="catalog-filter">
      <form action="#">
        <h2 className="visually-hidden">Фильтр</h2>
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Цена, ₽</legend>
          <div className="catalog-filter__price-range">
            <div className="custom-input">
              <label>
                <input
                  onChange={handlePriceMinChange}
                  value={priceMinValue}
                  type="number"
                  name="price"
                  placeholder={displayedCamerasMinPrice === 0 ? '' : displayedCamerasMinPrice.toString()}
                  defaultValue={selectedPriceMin === 0 ? undefined : selectedPriceMin}
                />
              </label>
            </div>
            <div className="custom-input">
              <label>
                <input
                  onChange={handlePriceMaxChange}
                  value={priceMaxValue}
                  type="number"
                  name="priceUp"
                  placeholder={displayedCamerasMaxPrice === Infinity ? '' : displayedCamerasMaxPrice.toString()}
                  defaultValue={selectedPriceMax === Infinity ? undefined : selectedPriceMax}
                />
              </label>
            </div>
          </div>
        </fieldset>
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Категория</legend>
          <div className="custom-radio catalog-filter__item">
            <label>
              <input
                data-testid={CATEGORY_FILTER_TEST_ID.CATEGORY_PHOTO_INPUT}
                onChange={makeCategoryOnChangeHandler(CATEGORY.PHOTO)}
                type="radio"
                name="category"
                defaultValue="photocamera"
                checked={selectedCategory === CATEGORY.PHOTO}
              />
              <span className="custom-radio__icon" />
              <span className="custom-radio__label">Фотокамера</span>
            </label>
          </div>
          <div className="custom-radio catalog-filter__item">
            <label>
              <input
                data-testid={CATEGORY_FILTER_TEST_ID.CATEGORY_VIDEO_INPUT}
                type="radio"
                name="category"
                defaultValue="videocamera"
                checked={selectedCategory === CATEGORY.VIDEO}
                onChange={makeCategoryOnChangeHandler(CATEGORY.VIDEO)}
              />
              <span className="custom-radio__icon" />
              <span className="custom-radio__label">Видеокамера</span>
            </label>
          </div>
        </fieldset>
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Тип камеры</legend>
          {Object.values(TYPE).map((item) => makeTypeFilterElement(item))}
        </fieldset>
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Уровень</legend>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input
                data-testid={LEVEL_FILTER_TEST_ID.LEVEL_ZERO_INPUT}
                type="checkbox"
                name="zero"
                onChange={makeLevelOnChangeHandler(LEVEL.ZERO)}
                checked={selectedLevels.includes(LEVEL.ZERO)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Нулевой</span>
            </label>
          </div>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input
                data-testid={LEVEL_FILTER_TEST_ID.LEVEL_ZERO_NON_PROFESSIONAL}
                type="checkbox"
                name="non-professional"
                onChange={makeLevelOnChangeHandler(LEVEL.NON_PROFESSIONAL)}
                checked={selectedLevels.includes(LEVEL.NON_PROFESSIONAL)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Любительский</span>
            </label>
          </div>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input
                data-testid={LEVEL_FILTER_TEST_ID.LEVEL_ZERO_PROFESSIONAL}
                type="checkbox"
                name="professional"
                onChange={makeLevelOnChangeHandler(LEVEL.PROFESSIONAL)}
                checked={selectedLevels.includes(LEVEL.PROFESSIONAL)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Профессиональный</span>
            </label>
          </div>
        </fieldset>
        <button onClick={handleResetButtonClick} className="btn catalog-filter__reset-btn" type="reset">
          Сбросить фильтры
        </button>
      </form>
    </div>
  );
}

export default Filters;
