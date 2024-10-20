import { generateReview } from '../../test/test-data-generators';
import { makeList } from '../../test/utils';
import slice, { ReviewsState, defaultState, resetReviews } from './reviews-slice';

describe('Reviews slice reducer tests', () => {
  it('resetReviews reducer resets state reviews', () => {
    const state: ReviewsState = {
      ...defaultState,
      reviews: makeList(10, () => generateReview())
    };

    const newState = slice.reducer(state, resetReviews());

    expect(newState.reviews).toEqual([]);
  });
});
