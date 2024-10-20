import { generateReview } from '../../test/test-data-generators';
import { makeList } from '../../test/utils';
import { defaultState, ReviewsState, selectReviewsNumber, selectDisplayedReviewsNumber, selectDisplayedReviews } from './reviews-slice';

describe('Reviews slice selectors tests', () => {
  it('selectReviewsNumber returns state.reviewsNumber', () => {
    const reviews = makeList(3, () => generateReview());
    const state: ReviewsState = { ...defaultState, reviews };

    expect(selectReviewsNumber.unwrapped(state)).toEqual(reviews.length);
  });

  it('selectDisplayedReviewsNumber returns state.displayedReviewsNumber', () => {
    const displayedReviewsNumber = 5;
    const state: ReviewsState = { ...defaultState, displayedReviewsNumber };

    expect(selectDisplayedReviewsNumber.unwrapped(state)).toEqual(displayedReviewsNumber);
  });

  it('selectDisplayedReviews returns sorted review list length of displayedReviewsNumber', () => {
    const TEN_SECONDS = 10000;
    const displayedReviewsNumber = 2;

    const reviews = [
      generateReview({ createAt: new Date(Date.now() + TEN_SECONDS).toISOString() }),
      generateReview({ createAt: new Date(Date.now() - TEN_SECONDS).toISOString() }),
      generateReview({ createAt: new Date(Date.now()).toISOString() }),
    ];

    const state: ReviewsState = { ...defaultState, reviews, displayedReviewsNumber };

    const expectedReviews = reviews.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()).slice(0, displayedReviewsNumber);
    expect(selectDisplayedReviews.unwrapped(state)).toEqual(expectedReviews);
  });
});
