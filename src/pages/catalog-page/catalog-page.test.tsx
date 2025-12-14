// not finished yet
// import { render, screen, act } from '@testing-library/react';
// import { Middleware } from '@reduxjs/toolkit';
// import userEvent from '@testing-library/user-event';
// import { CAMERAS_SLICE_NAME, CamerasState, defaultState as defaultCamerasState, makeCamerasSlice } from '../../store/cameras-slice/cameras-slice';
// import { createTestStore } from '../../test/store-utils';
// import { CamerasApi } from '../../api/cameras-api';
// import { withHistory, withRouter, withStore } from '../../test/pages-utils';
// import CatalogPage from './catalog-page';
// import { generateCamera } from '../../test/test-data-generators';
// import { makeList } from '../../test/utils';
// import { Camera } from '../../types';
// import { AppRoute, CATEGORY, LEVEL, MAX_DISPLAYED_CAMERAS_COUNT, TYPE } from '../../const';
// import { createMemoryHistory, MemoryHistory } from 'history';
// import { makeInfoButtonTestId } from '../../components/cameras-list/utils';
// import { CATEGORY_FILTER_TEST_ID, LEVEL_FILTER_TEST_ID, TYPE_FILTER_TEST_ID } from '../../components/filters/test-ids';
// import { makeOrderSlice, ORDER_SLICE_NAME, OrderState, defaultState as defaultOrderState } from '../../store/order-slice.ts/order-slice';
// import { reducer } from '../../store/store';

// type SliceStates = {
//   [CAMERAS_SLICE_NAME]?: Partial<CamerasState>;
//   [ORDER_SLICE_NAME]?: Partial<OrderState>;
// }

// const createPageStore = (
//   slices: Partial<Pick<typeof reducer, typeof CAMERAS_SLICE_NAME | typeof ORDER_SLICE_NAME>>,
//   camerasApi: Partial<CamerasApi> = {},
//   middleware?: Middleware
// ) => createTestStore(
//   slices,
//   { camerasApi },
//   middleware
// );

// const createSut = ({ cameras, order }: SliceStates) => withRouter(
//   withStore(
//     <CatalogPage />,
//     createPageStore({
//       cameras: makeCamerasSlice({ ...defaultCamerasState, ...cameras }).reducer,
//       order: makeOrderSlice({ ...defaultOrderState, ...order }).reducer
//     })
//   )
// );

// const renderSut = (sliceStates: SliceStates = {}) => {
//   const sut = createSut(sliceStates);

//   render(sut);
// };

// const renderSutWithHistory = ({ cameras, order }: SliceStates, history: MemoryHistory) => {
//   render(withHistory(
//     withStore(
//       <CatalogPage />,
//       createPageStore({
//         cameras: makeCamerasSlice({ ...defaultCamerasState, ...cameras }).reducer,
//         order: makeOrderSlice({ ...defaultOrderState, ...order }).reducer
//       })
//     ),
//     history)
//   );
// };

// const clickProductButton = async (cameraId: Camera['id']) => {
//   const buyButton = screen.getByTestId(makeInfoButtonTestId(cameraId));
//   await act(() => userEvent.click(buyButton));
// };

// const clickFilter = async (testId: string) => {
//   const element = screen.getByTestId(testId);
//   await act(() => userEvent.click(element));
// };

// describe('Catalog page tests', () => {
//   it('cameras from slice state is presented on screed', () => {
//     const cameras = makeList(MAX_DISPLAYED_CAMERAS_COUNT, () => generateCamera());

//     renderSut({ [CAMERAS_SLICE_NAME]: { cameras } });

//     cameras.forEach((camera) => {
//       expect(screen.queryByText(camera.name)).toBeInTheDocument();
//     });
//   });

//   it('navigation to camera page on product card info button click', async () => {
//     const camera = generateCamera();
//     const history = createMemoryHistory();
//     renderSutWithHistory({ [CAMERAS_SLICE_NAME]: { cameras: [camera] } }, history);

//     await clickProductButton(camera.id);

//     expect(history.location.pathname).toBe(`${AppRoute.Cameras}/${camera.id}`);
//   });

//   it('category filter was added to url search params on category filter input click', async () => {
//     const history = createMemoryHistory();
//     renderSutWithHistory({}, history);

//     await clickFilter(CATEGORY_FILTER_TEST_ID.CATEGORY_PHOTO_INPUT);
//     expect(history.location.search.includes(`category=${encodeURI(CATEGORY.PHOTO)}`)).toBe(true);
//   });

//   it('type filter was added to url search params on type filter input click', async () => {
//     const history = createMemoryHistory();
//     renderSutWithHistory({}, history);

//     await clickFilter(TYPE_FILTER_TEST_ID.COLLECTION);
//     await clickFilter(TYPE_FILTER_TEST_ID.DIGITAL);

//     [TYPE.COLLECTION, TYPE.DIGITAL].forEach((cameraType) => {
//       expect(history.location.search.includes(`type=${encodeURI(cameraType)}`)).toBe(true);
//     });
//   });

//   it('level filter was added to url search params on level filter input click', async () => {
//     const history = createMemoryHistory();
//     renderSutWithHistory({}, history);

//     await clickFilter(LEVEL_FILTER_TEST_ID.LEVEL_ZERO_INPUT);
//     await clickFilter(LEVEL_FILTER_TEST_ID.LEVEL_ZERO_NON_PROFESSIONAL);

//     [LEVEL.NON_PROFESSIONAL, LEVEL.ZERO].forEach((level) => {
//       expect(history.location.search.includes(`level=${encodeURI(level)}`)).toBe(true);
//     });
//   });

//   it('filters were reset and url has no search params after reset filters button click', async () => {
//     const history = createMemoryHistory();
//     renderSutWithHistory({}, history);

//     await clickFilter(CATEGORY_FILTER_TEST_ID.CATEGORY_PHOTO_INPUT);
//     await clickFilter(TYPE_FILTER_TEST_ID.COLLECTION);
//     await clickFilter(TYPE_FILTER_TEST_ID.DIGITAL);
//     await clickFilter(LEVEL_FILTER_TEST_ID.LEVEL_ZERO_INPUT);
//     await clickFilter(LEVEL_FILTER_TEST_ID.LEVEL_ZERO_NON_PROFESSIONAL);

//     [CATEGORY_FILTER_TEST_ID.CATEGORY_PHOTO_INPUT, TYPE.COLLECTION, TYPE.DIGITAL, LEVEL.NON_PROFESSIONAL, LEVEL.ZERO].forEach((filterItem) => {
//       expect(history.location.search.includes(filterItem)).toBe(false);
//     });
//   });
// });
