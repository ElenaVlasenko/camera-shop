import { SortingKey, SortingOrder } from '../../const';
import { useAppDispatch } from '../../hooks/hooks';
import { setSortingKey, setSortingOrder } from '../../store/cameras-slice/cameras-slice';

function Sort(): JSX.Element {
  const dispatch = useAppDispatch();

  const handleSortingKeyButtonClick = (sortingKey: SortingKey) => {
    dispatch(setSortingKey(sortingKey));
  };
  const handleSortingDirectionButtonClick = (sortingOrder: SortingOrder) => {
    dispatch(setSortingOrder(sortingOrder));
  };

  return (
    <div className="catalog-sort">
      <form action="#">
        <div className="catalog-sort__inner">
          <p className="title title--h5">Сортировать:</p>
          <div className="catalog-sort__type">
            <div onClick={() => handleSortingKeyButtonClick(SortingKey.Price)} className="catalog-sort__btn-text">
              <input type="radio" id="sortPrice" name="sort" defaultChecked />
              <label htmlFor="sortPrice">по цене</label>
            </div>
            <div onClick={() => handleSortingKeyButtonClick(SortingKey.Rating)} className="catalog-sort__btn-text">
              <input type="radio" id="sortPopular" name="sort" />
              <label htmlFor="sortPopular">по популярности</label>
            </div>
          </div>
          <div className="catalog-sort__order">
            <div onClick={() => handleSortingDirectionButtonClick(SortingOrder.ASC)} className="catalog-sort__btn catalog-sort__btn--up">
              <input
                type="radio"
                id="up"
                name="sort-icon"
                defaultChecked
                aria-label="По возрастанию"
              />
              <label htmlFor="up">
                <svg width={16} height={14} aria-hidden="true">
                  <use xlinkHref="#icon-sort" />
                </svg>
              </label>
            </div>
            <div onClick={() => handleSortingDirectionButtonClick(SortingOrder.DESC)} className="catalog-sort__btn catalog-sort__btn--down">
              <input
                type="radio"
                id="down"
                name="sort-icon"
                aria-label="По убыванию"
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
