import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Middleware } from '@reduxjs/toolkit';
import { CAMERAS_SLICE_NAME, CamerasState, defaultState as defaultCamerasState, makeCamerasSlice } from '../../store/cameras-slice/cameras-slice';
import { createTestStore } from '../../test/store-utils';
import { CamerasApi } from '../../api/cameras-api';
import { withRouter, withStore } from '../../test/pages-utils';
import { generateCamera, generateReview } from '../../test/test-data-generators';
import CameraPage from './camera-page';
import { ReviewsApi } from '../../api/reviews-api';
import { reducer } from '../../store/store';
import { REVIEWS_SLICE_NAME, ReviewsState, defaultState as defaultReviewsState, makeReviewsSlice } from '../../store/reviews-slice.ts/reviews-slice';
import { clickTo, makeList } from '../../test/utils';
import { BACK_TO_TOP_BUTTON_ID, DESCRIPTION_BUTTON_ID, DESCRIPTION_SECTION_ID, PROPERTIES_BUTTON_ID, PROPERTIES_SECTION_ID } from './utils';
import { SIMILAR_PRODUCTS_SECTION_ID } from '../../components/cameras-similar/utils';
import { REVIEW_CARD_CLASS_NAME, REVIEWS_SECTION_TEST_ID } from '../../components/reviews-list/utils';
import { SHOW_MORE_REVIEW_BUTTON_ID } from '../../components/show-more-button/utils';
import { DISPLAYED_REVIEWS_NUMBER_STEP } from '../../const';
import { makeOrderSlice, ORDER_SLICE_NAME, OrderState } from '../../store/order-slice.ts/order-slice';

type Fakes = { camerasApi?: Partial<CamerasApi>; reviewsApi?: Partial<ReviewsApi> };

type SliceStates = {
  [CAMERAS_SLICE_NAME]?: Partial<CamerasState>;
  [REVIEWS_SLICE_NAME]?: Partial<ReviewsState>;
  [ORDER_SLICE_NAME]?: Partial<OrderState>;
}

const createPageStore = (
  slices: Partial<Pick<typeof reducer, typeof CAMERAS_SLICE_NAME | typeof REVIEWS_SLICE_NAME | typeof ORDER_SLICE_NAME>>,
  fakes: Fakes = {},
  middleware?: Middleware
) => createTestStore(slices, fakes, middleware);

const camera = generateCamera();

const createSut = ({ cameras, reviews }: SliceStates) => withRouter(withStore(
  <CameraPage {...camera} />,
  createPageStore({
    [CAMERAS_SLICE_NAME]: makeCamerasSlice({ ...defaultCamerasState, ...cameras }).reducer,
    [REVIEWS_SLICE_NAME]: makeReviewsSlice({ ...defaultReviewsState, ...reviews }).reducer,
    [ORDER_SLICE_NAME]: makeOrderSlice().reducer,
  })
));

const clickBackToTop = clickTo(BACK_TO_TOP_BUTTON_ID);
const clickDescriptionButton = clickTo(DESCRIPTION_BUTTON_ID);
const clickPropertiesButton = clickTo(PROPERTIES_BUTTON_ID);
const clickShowMoreButton = clickTo(SHOW_MORE_REVIEW_BUTTON_ID);

const renderSut = (sliceState: SliceStates = {}) => render(createSut(sliceState));

const scrollToTop = vi.fn();
window.scrollTo = scrollToTop;

describe('Camera page tests', () => {
  it('window.scrollToTop have been called on back to top button click', async () => {
    renderSut();

    await clickBackToTop();

    const [scrollToTopParams] = (scrollToTop.mock.calls.at(-1) ?? []) as unknown[];
    const expectedScrollParams = { top: 0, left: 0, behavior: 'smooth' };
    expect(scrollToTopParams).toEqual(expectedScrollParams);
  });

  it('similar product section does NOT exist in the document when similar product list is empty', () => {
    renderSut({ cameras: { similar: [] } });

    const similarSection = screen.queryByTestId(SIMILAR_PRODUCTS_SECTION_ID);
    expect(similarSection).not.toBeInTheDocument();
  });

  it('similar product section does exists in the document when similar product list is not empty', () => {
    renderSut({ cameras: { similar: [generateCamera()] } });

    const similarSection = screen.queryByTestId(SIMILAR_PRODUCTS_SECTION_ID);
    expect(similarSection).toBeInTheDocument();
  });

  it('reviews section does NOT exist in the document when reviews list is empty', () => {
    renderSut({ reviews: { reviews: [] } });

    const similarSection = screen.queryByTestId(REVIEWS_SECTION_TEST_ID);
    expect(similarSection).not.toBeInTheDocument();
  });

  it('reviews section exists in the document when reviews list is empty', () => {
    renderSut({ reviews: { reviews: [generateReview()] } });

    const reviewSection = screen.queryByTestId(REVIEWS_SECTION_TEST_ID);
    expect(reviewSection).toBeInTheDocument();
  });

  it('displayed review on screen satisfies to displayedReviewsNumber in slice state', () => {
    const displayedReviewsNumber = 3;
    const reviews = makeList(displayedReviewsNumber * 2, () => generateReview());
    const { container } = renderSut({ reviews: { reviews, displayedReviewsNumber } });

    const reviewCards = container.getElementsByClassName(REVIEW_CARD_CLASS_NAME);
    expect(reviewCards.length).toBe(displayedReviewsNumber);
  });

  it('show more button have been displayed when not all reviews is displayed', () => {
    const displayedReviewsNumber = 3;
    const reviews = makeList(displayedReviewsNumber * 2, () => generateReview());
    renderSut({ reviews: { reviews, displayedReviewsNumber } });

    const showMoreButton = screen.queryByTestId(SHOW_MORE_REVIEW_BUTTON_ID);
    expect(showMoreButton).toBeInTheDocument();
  });

  it('show more button have NOT been displayed when all reviews is displayed', () => {
    const displayedReviewsNumber = 3;
    const reviews = makeList(displayedReviewsNumber, () => generateReview());
    renderSut({ reviews: { reviews, displayedReviewsNumber } });

    const showMoreButton = screen.queryByTestId(SHOW_MORE_REVIEW_BUTTON_ID);
    expect(showMoreButton).not.toBeInTheDocument();
  });

  it('additional reviews have been displayed when "show more" button was clicked', async () => {
    const displayedReviewsNumber = 3;
    const reviews = makeList(displayedReviewsNumber * 3, () => generateReview());
    const { container } = renderSut({ reviews: { reviews, displayedReviewsNumber } });

    const reviewCardsBeforeClick = container.getElementsByClassName(REVIEW_CARD_CLASS_NAME);
    expect(reviewCardsBeforeClick.length).toBe(displayedReviewsNumber);

    await clickShowMoreButton();

    const reviewCardsAfterClick = container.getElementsByClassName(REVIEW_CARD_CLASS_NAME);
    expect(reviewCardsAfterClick.length).toBe(displayedReviewsNumber + DISPLAYED_REVIEWS_NUMBER_STEP);
  });

  it('by default description is displayed', () => {
    renderSut();

    const descriptionTabContent = screen.getByTestId(DESCRIPTION_SECTION_ID);
    const propertiesTabContent = screen.getByTestId(PROPERTIES_SECTION_ID);
    expect(descriptionTabContent.className.includes('is-active')).toBe(true);
    expect(propertiesTabContent.className.includes('is-active')).toBe(false);
  });

  it('properties have been displayed on properties button click', async () => {
    renderSut();

    await clickPropertiesButton();

    const descriptionTabContent = screen.getByTestId(DESCRIPTION_SECTION_ID);
    const propertiesTabContent = screen.getByTestId(PROPERTIES_SECTION_ID);
    expect(descriptionTabContent.className.includes('is-active')).toBe(false);
    expect(propertiesTabContent.className.includes('is-active')).toBe(true);
  });

  it('description content contains required data', async () => {
    renderSut();

    await clickPropertiesButton();

    const description = screen.getByText(camera.description);
    expect(description).toBeInTheDocument();
  });

  it('properties content contains required data', async () => {
    renderSut();

    await clickPropertiesButton();

    const vendorCode = screen.getByText(camera.vendorCode);
    const category = screen.getByText(camera.category);
    const cameraType = screen.getByText(camera.type);
    const level = screen.getByText(camera.level);
    expect(vendorCode).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(cameraType).toBeInTheDocument();
    expect(level).toBeInTheDocument();
  });

  it('description have been displayed on description tab click', async () => {
    renderSut();

    await clickPropertiesButton();
    await clickDescriptionButton();

    const descriptionTabContent = screen.getByTestId(DESCRIPTION_SECTION_ID);
    const propertiesTabContent = screen.getByTestId(PROPERTIES_SECTION_ID);
    expect(descriptionTabContent.className.includes('is-active')).toBe(true);
    expect(propertiesTabContent.className.includes('is-active')).toBe(false);
  });
});
