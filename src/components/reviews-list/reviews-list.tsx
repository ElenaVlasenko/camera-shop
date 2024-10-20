import { Review } from '../../types';
import ReviewItemOfAList from './review-list-item';

type Props = {
  reviews: Review[];
}

function ReviewsList({ reviews }: Props): JSX.Element {

  return (
    <ul className="review-block__list">
      {reviews.map((review) => <ReviewItemOfAList key={review.id} review={review} />)}
    </ul>
  );
}

export default ReviewsList;
