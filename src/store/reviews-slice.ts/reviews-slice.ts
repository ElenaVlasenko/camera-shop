import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { Review, ReviewParams } from '../../types';
import { ReviewsApi } from '../../api/reviews-api';
import { createSelector } from 'reselect';
import { DISPLAYED_REVIEWS_NUMBER_STEP, REQUEST_STATUS, RequestStatus } from '../../const';
import { showErrorMessage } from '../error-slice/error-slice';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type ReviewsState = {
  reviews: Review[];
  displayedReviewsNumber: number;
  reviewRequestStatus: null | RequestStatus;
}

export const defaultState: ReviewsState = {
  reviews: [],
  displayedReviewsNumber: DISPLAYED_REVIEWS_NUMBER_STEP,
  reviewRequestStatus: null,
};

export const REVIEWS_SLICE_NAME = 'reviews';

const selectStateReviews = (state: Pick<ReviewsState, 'reviews'>) => state.reviews;
const selectStateDisplayedReviewsNumber = (state: Pick<ReviewsState, 'displayedReviewsNumber'>) => state.displayedReviewsNumber;

const sortedReviews = createSelector(
  [
    selectStateReviews
  ],
  (reviews) => [...reviews].sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
);

const displayedReviews = createSelector(
  [
    sortedReviews,
    selectStateDisplayedReviewsNumber
  ],
  (reviews, displayedReviewsNumber) => reviews.slice(0, displayedReviewsNumber)
);

export const makeReviewsSlice = (initialState: ReviewsState) => createSliceWithThunks({
  name: REVIEWS_SLICE_NAME,
  initialState,
  selectors: {
    selectReviewsNumber: (state) => state.reviews.length,
    selectDisplayedReviews: displayedReviews,
    selectDisplayedReviewsNumber: (state) => state.displayedReviewsNumber,
    selectReviewRequestStatus: (state) => state.reviewRequestStatus
  },
  reducers: (create) => ({
    fetchReviewsAction: create.asyncThunk<Review[], number, { extra: { reviewsApi: ReviewsApi } }>(
      async (id, { extra: { reviewsApi }, dispatch }) => reviewsApi.getList(id).catch((err) => {
        showErrorMessage(err, dispatch);
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
    addReviewAction: create.asyncThunk<Review, ReviewParams, { extra: { reviewsApi: ReviewsApi } }>(
      async (reviewParams, { extra: { reviewsApi }, dispatch }) => reviewsApi.addReview(reviewParams).catch((err) => {
        showErrorMessage(err, dispatch);
        throw err;
      }),
      {
        fulfilled: (state, action) => {
          state.reviews = [action.payload, ...state.reviews];
          state.reviewRequestStatus = REQUEST_STATUS.SUCCESS;
        },
        pending: (state) => {
          state.reviewRequestStatus = REQUEST_STATUS.IN_PROGRESS;
        },
        rejected: (state) => {
          state.reviewRequestStatus = REQUEST_STATUS.FAILED;
        }
      }),
    resetReviews: create.reducer((state) => {
      state.reviews = [];
      state.displayedReviewsNumber = DISPLAYED_REVIEWS_NUMBER_STEP;
    }),
    resetReviewRequestStatus: create.reducer((state) => {
      state.reviewRequestStatus = null;
    }),
    increaseDisplayedReviewsNumber: create.reducer((state) => {
      state.displayedReviewsNumber = Math.min(state.reviews.length, state.displayedReviewsNumber + DISPLAYED_REVIEWS_NUMBER_STEP);
    }),
    resetDisplayedReviewsNumber: create.reducer((state) => {
      state.displayedReviewsNumber = DISPLAYED_REVIEWS_NUMBER_STEP;
    }),
  }),
});

const reviewsSlice = makeReviewsSlice(defaultState);

export default reviewsSlice;

export const {
  selectDisplayedReviews,
  selectReviewsNumber,
  selectDisplayedReviewsNumber,
  selectReviewRequestStatus
} = reviewsSlice.selectors;

export const {
  fetchReviewsAction,
  resetReviews,
  increaseDisplayedReviewsNumber,
  resetDisplayedReviewsNumber,
  addReviewAction,
  resetReviewRequestStatus
} = reviewsSlice.actions;
