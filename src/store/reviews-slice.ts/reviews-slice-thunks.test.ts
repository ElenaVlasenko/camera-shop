import { ReviewsApi } from '../../api/reviews-api';
import { createTestStore } from '../../test/store-utils';
import { generateReview } from '../../test/test-data-generators';
import { makeList } from '../../test/utils';
import { fetchReviewsAction } from './reviews-slice';
import reviewsSlice, { REVIEWS_SLICE_NAME } from './reviews-slice';

type Fakes = {
  reviewsApi: Partial<ReviewsApi>;
};

const createStore = (fakes: Fakes) => createTestStore(
  {
    [REVIEWS_SLICE_NAME]: reviewsSlice.reducer,
  },
  fakes,
);

type Store = ReturnType<typeof createTestStore>;

const getState = (store: Store) => store.getState()[REVIEWS_SLICE_NAME];

describe('Review slice thunks test', () => {
  describe('fetchReviewsAction thunk tests', () => {
    it('thunk sets gotten cameras to state', async () => {
      const cameraId = 123;
      const reviews = makeList(10, () => generateReview({ cameraId }));

      const store = createStore({
        reviewsApi: {
          getList: (pCameraId) => {
            expect(cameraId).toEqual(pCameraId);
            return Promise.resolve(reviews);
          }
        }
      });

      await store.dispatch(fetchReviewsAction(cameraId));

      expect(getState(store).reviews).toEqual(reviews);
    });
  });
});
