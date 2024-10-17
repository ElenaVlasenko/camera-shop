import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { showErrorMessage } from './error-slice';
import { isAxiosNotFoundError } from '../utils';
import { Review } from '../../types';
import { ReviewsApi } from '../../api/reviews-api';
import { createSelector } from 'reselect';
import { DISPLAYED_REVIEWS_NUMBER_STEP } from '../../const';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type ReviewsState = {
  reviews: Review[];
  displayedReviewsNumber: number;
}

const initialState: ReviewsState = {
  reviews: [],
  displayedReviewsNumber: DISPLAYED_REVIEWS_NUMBER_STEP,
};

export const REVIEWS_SLICE_NAME = 'reviews';

const selectStateReviews = (state: Pick<ReviewsState, 'reviews'>) => state.reviews;
const selectStateDisplayedReviewsNumber = (state: Pick<ReviewsState, 'displayedReviewsNumber'>) => state.displayedReviewsNumber;

const sortedReviews = createSelector([
  selectStateReviews
],
  (reviews) => [...reviews].sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime())
);

const displayedReviews = createSelector([
  sortedReviews,
  selectStateDisplayedReviewsNumber
],
  (reviews, displayedReviewsNumber) => reviews.slice(0, displayedReviewsNumber)
);

const reviewsSlice = createSliceWithThunks({
  name: REVIEWS_SLICE_NAME,
  initialState,
  selectors: {
    selectReviewsNumber: (state) => state.reviews.length,
    selectDisplayedReviews: displayedReviews,
    selectDisplayedReviewsNumber: (state) => state.displayedReviewsNumber,
  },
  reducers: (create) => ({
    fetchReviewsAction: create.asyncThunk<Review[], number, { extra: { reviewsApi: ReviewsApi } }>(
      async (id, { extra: { reviewsApi }, dispatch }) => reviewsApi.getList(id).catch((err) => {
        // if (!isAxiosNotFoundError(err)) {
        //   showErrorMessage(err, dispatch);
        // }

        throw err;
      }),
      {
        fulfilled: (state, action) => {
          state.reviews = action.payload;
        },
        pending: (state) => {
          state.reviews = [];
        },
      }
    ),
    resetReviews: create.reducer((state) => {
      state.reviews = [];
    }),
    increaseDisplayedReviewsNumber: create.reducer((state) => {
      state.displayedReviewsNumber = Math.min(state.reviews.length, state.displayedReviewsNumber + DISPLAYED_REVIEWS_NUMBER_STEP);
    }),
    resetDisplayedReviewsNumber: create.reducer((state) => {
      state.displayedReviewsNumber = DISPLAYED_REVIEWS_NUMBER_STEP;
    }),
  }),
});

export default reviewsSlice;

export const {
  selectDisplayedReviews,
  selectReviewsNumber,
  selectDisplayedReviewsNumber,
} = reviewsSlice.selectors;

export const {
  fetchReviewsAction,
  resetReviews,
  increaseDisplayedReviewsNumber,
  resetDisplayedReviewsNumber,
} = reviewsSlice.actions;
