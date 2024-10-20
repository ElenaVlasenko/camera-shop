import { useAppDispatch } from '../../hooks/hooks';
import { increaseDisplayedReviewsNumber } from '../../store/reviews-slice.ts/reviews-slice';
import { SHOW_MORE_REVIEW_BUTTON_ID } from './utils';

function ShowMoreButton(): JSX.Element {
  const dispatch = useAppDispatch();
  function handleClick() {
    dispatch(increaseDisplayedReviewsNumber());
  }
  return (
    <button data-testid={SHOW_MORE_REVIEW_BUTTON_ID} onClick={handleClick} className="btn btn--purple" type="button">
      Показать больше отзывов
    </button>
  );
}

export default ShowMoreButton;
