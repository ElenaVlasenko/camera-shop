import { useEffect } from 'react';
import { KEYCODE_DOWN, KEYCODE_UP, SortingKey, SortingOrder } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { selectSortingKey, selectSortingOrder, setSortingKey, setSortingOrder } from '../../store/cameras-slice/cameras-slice';
import { useNavigate } from 'react-router-dom';

const sortingOrders = Object.values(SortingOrder);
const sortingKeys = Object.values(SortingKey);

const isValidSortingKey = (key: string): key is SortingKey => (sortingKeys as string[]).includes(key);
const isValidSortingOrder = (order: string): order is SortingOrder => (sortingOrders as string[]).includes(order);

function Sort(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedSortingOrder = useAppSelector(selectSortingOrder);
  const selectedSortingKey = useAppSelector(selectSortingKey);

  const handleSortingKeyButtonClick = (sortingKey: SortingKey) => {
    dispatch(setSortingKey(sortingKey));
  };

  const handleSortingDirectionButtonClick = (sortingOrder: SortingOrder) => {
    dispatch(setSortingOrder(sortingOrder));
  };

  const makeSortingOrderChangeHandler = (sortingOrder: SortingOrder) => () => {
    const urlParams = new URLSearchParams(location.search);
    handleSortingDirectionButtonClick(sortingOrder);
    urlParams.set('sortingOrder', sortingOrder);
    navigate(`${location.pathname}?${urlParams.toString()}`);
  };

  const makeSortingKeyChangeHandler = (sortingKey: SortingKey) => () => {
    const urlParams = new URLSearchParams(location.search);
    handleSortingKeyButtonClick(sortingKey);
    urlParams.set('sortBy', sortingKey);
    navigate(`${location.pathname}?${urlParams.toString()}`);
  };

  const changeSortingToASC = makeSortingOrderChangeHandler(SortingOrder.ASC);
  const changeSortingToDESC = makeSortingOrderChangeHandler(SortingOrder.DESC);

  useEffect(
    () => {
      const urlParams = new URLSearchParams(location.search);

      const urlSortingOrder = urlParams.get('sortingOrder') ?? '';

      if (isValidSortingOrder(urlSortingOrder) && selectedSortingOrder !== urlSortingOrder) {
        dispatch(setSortingOrder(urlSortingOrder));
        urlParams.set('sortingOrder', urlSortingOrder);
        navigate(`${location.pathname}?${urlParams.toString()}`);
      }

      if (urlSortingOrder === '') {
        urlParams.set('sortingOrder', selectedSortingOrder);
        navigate(`${location.pathname}?${urlParams.toString()}`);
      }

      const urlSortingKey = urlParams.get('sortBy') ?? '';

      if (isValidSortingKey(urlSortingKey) && selectedSortingKey !== urlSortingKey) {
        dispatch(setSortingKey(urlSortingKey));
        urlParams.set('sortBy', urlSortingKey);
        navigate(`${location.pathname}?${urlParams.toString()}`);
      }

      if (urlSortingKey === '') {
        urlParams.set('sortBy', selectedSortingKey);
        navigate(`${location.pathname}?${urlParams.toString()}`);
      }

      function handleUpDownKey(event: KeyboardEvent) {
        const isDownPressed = event.code === KEYCODE_DOWN;
        const isUpPressed = event.code === KEYCODE_UP;
        if (isDownPressed) {
          event.preventDefault();
          changeSortingToDESC();
        }

        if (isUpPressed) {
          event.preventDefault();
          changeSortingToASC();
        }
      }

      document.addEventListener('keydown', handleUpDownKey);

      return () => {
        document.removeEventListener('keydown', handleUpDownKey);
      };
    },
    [navigate, dispatch, selectedSortingOrder, selectedSortingKey, changeSortingToASC, changeSortingToDESC]
  );

  return (
    <div className="catalog-sort">
      <form action="#">
        <div className="catalog-sort__inner">
          <p className="title title--h5">Сортировать:</p>
          <div className="catalog-sort__type">
            <div className="catalog-sort__btn-text">
              <input
                type="radio"
                id="sortPrice"
                name="sort"
                checked={selectedSortingKey === SortingKey.Price}
                onChange={makeSortingKeyChangeHandler(SortingKey.Price)}
              />
              <label htmlFor="sortPrice">по цене</label>
            </div>
            <div className="catalog-sort__btn-text">
              <input
                type="radio"
                id="sortPopular"
                name="sort"
                checked={selectedSortingKey === SortingKey.Rating}
                onChange={makeSortingKeyChangeHandler(SortingKey.Rating)}
              />
              <label htmlFor="sortPopular">по популярности</label>
            </div>
          </div>
          <div className="catalog-sort__order">
            <div className="catalog-sort__btn catalog-sort__btn--up">
              <input
                type="radio"
                id="up"
                name="sort-icon"
                aria-label="По возрастанию"
                checked={selectedSortingOrder === SortingOrder.ASC}
                onChange={() => changeSortingToASC()}
              />
              <label htmlFor="up">
                <svg width={16} height={14} aria-hidden="true">
                  <use xlinkHref="#icon-sort" />
                </svg>
              </label>
            </div>
            <div className="catalog-sort__btn catalog-sort__btn--down">
              <input
                type="radio"
                id="down"
                name="sort-icon"
                aria-label="По убыванию"
                checked={selectedSortingOrder === SortingOrder.DESC}
                onChange={() => changeSortingToDESC()}
              />
              <label htmlFor="down">
                <svg width={16} height={14} aria-hidden="true">
                  <use xlinkHref="#icon-sort" />
                </svg>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Sort;
