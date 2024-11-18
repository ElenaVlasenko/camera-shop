import { ChangeEvent, useState, useCallback } from 'react';
import { CATEGORY, Category, LEVEL, Level, TYPE, Type } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  resetFilters,
  removeLevel,
  removeType,
  selectLevels,
  selectTypes,
  setCategory,
  setLevel,
  setType,
  selectPriceMin,
  setPriceMin,
  setPriceMax,
  selectDisplayedCamerasWithoutPriceFilter,
  selectPriceMax,
  selectCategory
} from '../../store/cameras-slice/cameras-slice';
import { debounce } from '../../utils';

const PRICE_HANDLING_TIMEOUT = 1000;

function Filters(): JSX.Element {
  const dispatch = useAppDispatch();
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

  const handleCategoryButtonClick = (category: Category) => {
    dispatch(setCategory(category));
  };

  const handleTypeButtonClick = (cameraType: Type) => {
    if (selectedTypes.includes(cameraType)) {
      dispatch(removeType(cameraType));
    } else {
      dispatch(setType(cameraType));
    }
  };

  const handleLevelButtonClick = (level: Level) => {
    if (selectedLevels.includes(level)) {
      dispatch(removeLevel(level));
    } else {
      dispatch(setLevel(level));
    }
  };

  const handleResetButtonClick = () => {
    dispatch(resetFilters());
    setMinPriceValue('');
    setMaxPriceValue('');
  };

  const updatePriceMin = (newValue: number) => {
    setMinPriceValue(newValue.toString());
    dispatch(setPriceMin(newValue));
  };

  const updatePriceMax = (newValue: number) => {
    setMaxPriceValue(newValue.toString());
    dispatch(setPriceMax(newValue));
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
          <div onClick={() => handleCategoryButtonClick(CATEGORY.PHOTO)} className="custom-radio catalog-filter__item">
            <label>
              <input
                type="radio"
                name="category"
                defaultValue="photocamera"
              />
              <span className="custom-radio__icon" />
              <span className="custom-radio__label">Фотокамера</span>
            </label>
          </div>
          <div onClick={() => handleCategoryButtonClick(CATEGORY.VIDEO)} className="custom-radio catalog-filter__item">
            <label>
              <input type="radio" name="category" defaultValue="videocamera" />
              <span className="custom-radio__icon" />
              <span className="custom-radio__label">Видеокамера</span>
            </label>
          </div>
        </fieldset>
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Тип камеры</legend>
          <div className="custom-checkbox catalog-filter__item" >
            <label>
              <input
                onChange={() => handleTypeButtonClick(TYPE.DIGITAL)}
                type="checkbox"
                name="digital"
                checked={selectedTypes.includes(TYPE.DIGITAL)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Цифровая</span>
            </label>
          </div>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input
                onChange={() => handleTypeButtonClick(TYPE.FILM)}
                type="checkbox"
                name="film"
                disabled={selectedCategory === CATEGORY.VIDEO}
                checked={selectedTypes.includes(TYPE.FILM)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Плёночная</span>
            </label>
          </div>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input
                onChange={() => handleTypeButtonClick(TYPE.SNAPSHOT)}
                type="checkbox"
                name="snapshot"
                disabled={selectedCategory === CATEGORY.VIDEO}
                checked={selectedTypes.includes(TYPE.SNAPSHOT)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Моментальная</span>
            </label>
          </div>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input
                onChange={() => handleTypeButtonClick(TYPE.COLLECTION)}
                type="checkbox"
                name="collection"
                checked={selectedTypes.includes(TYPE.COLLECTION)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Коллекционная</span>
            </label>
          </div>
        </fieldset>
        <fieldset className="catalog-filter__block">
          <legend className="title title--h5">Уровень</legend>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input type="checkbox"
                name="zero"
                onChange={() => handleLevelButtonClick(LEVEL.ZERO)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Нулевой</span>
            </label>
          </div>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input type="checkbox" name="non-professional"
                onChange={() => handleLevelButtonClick(LEVEL.NON_PROFESSIONAL)}
              />
              <span className="custom-checkbox__icon" />
              <span className="custom-checkbox__label">Любительский</span>
            </label>
          </div>
          <div
            className="custom-checkbox catalog-filter__item"
          >
            <label>
              <input type="checkbox" name="professional"
                onChange={() => handleLevelButtonClick(LEVEL.PROFESSIONAL)}
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
