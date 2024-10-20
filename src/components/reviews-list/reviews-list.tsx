import { Review } from '../../types';
import ReviewItemOfAList from './review-list-item';
import { REVIEWS_SECTION_TEST_ID } from './utils';

type Props = {
  reviews: Review[];
}

function ReviewsList({ reviews }: Props): JSX.Element {
  return (
    <ul data-testid={REVIEWS_SECTION_TEST_ID} className="review-block__list">
      {reviews.map((review) => <ReviewItemOfAList key={review.id} review={review} />)}
    </ul>
  );
}

export default ReviewsList;
