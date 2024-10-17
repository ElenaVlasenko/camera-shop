import { useAppDispatch } from '../../hooks/hooks';
import { increaseDisplayedReviewsNumber } from '../../store/reviews-slice.ts/reviews-slice';

function ShowMoreButton(): JSX.Element {
  const dispatch = useAppDispatch();
  function handleClick() {
    dispatch(increaseDisplayedReviewsNumber());
  }
  return (
    <button onClick={handleClick} className="btn btn--purple" type="button">
      Показать больше отзывов
    </button>
  );
}

export default ShowMoreButton;
