import { CATEGORY, LEVEL, SortingKey, SortingOrder, TYPE } from '../../const';
import { generateCamera } from '../../test/test-data-generators';
import { getRandomArrayElement, idsOf, intBetween, makeList } from '../../test/utils';
import { Camera } from '../../types';
import { CamerasState, defaultState, selectCameras, selectDisplayedCameras, selectIsCamerasLoading, selectPromo, selectSimilar } from './cameras-slice';

const expectEqualItems = (cameraList1: Camera[], cameraList2: Camera[]) => {
  expect(cameraList1.length).toEqual(cameraList2.length);

  const list1Ids = idsOf(cameraList1);
  const list2Ids = idsOf(cameraList2);
  expect(list1Ids.every((id) => list2Ids.includes(id))).toBe(true);
};

describe('Camera slice selectors tests', () => {
  it('selectCameras returns state.cameras', () => {
    const cameras = makeList(3, () => generateCamera());
    const state: CamerasState = { ...defaultState, cameras };

    expect(selectCameras.unwrapped(state)).toEqual(cameras);
  });

  it('selectPromo returns state.promo', () => {
    const promo = makeList(3, () => generateCamera());
    const state: CamerasState = { ...defaultState, promo };

    expect(selectPromo.unwrapped(state)).toEqual(promo);
  });

  it('selectSimilar returns state.similar', () => {
    const similar = makeList(3, () => generateCamera());
    const state: CamerasState = { ...defaultState, similar };

    expect(selectSimilar.unwrapped(state)).toEqual(similar);
  });

  it('selectIsCamerasLoading returns state.isCamerasLoading', () => {
    const isCamerasLoading = true;
    const state: CamerasState = { ...defaultState, isCamerasLoading };

    expect(selectIsCamerasLoading.unwrapped(state)).toEqual(isCamerasLoading);
  });

  describe('selectDisplayedCameras tests', () => {
    it('selectDisplayedCameras returns cameras filtered by type when state.types is not empty', () => {
      const subjectTypes = [TYPE.DIGITAL, TYPE.FILM];
      const subjects = makeList(3, () => generateCamera({ type: getRandomArrayElement(subjectTypes) }));
      const control = makeList(3, () => generateCamera({ type: getRandomArrayElement([TYPE.COLLECTION, TYPE.SNAPSHOT]) }));
      const state: CamerasState = { ...defaultState, cameras: [...control, ...subjects], types: subjectTypes };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      expectEqualItems(displayedCameras, subjects);
    });

    it('selectDisplayedCameras returns cameras filtered by category when state.category was set', () => {
      const subjectCategory = CATEGORY.PHOTO;
      const subjects = makeList(3, () => generateCamera({ category: subjectCategory }));
      const control = makeList(3, () => generateCamera({ category: CATEGORY.VIDEO }));
      const state: CamerasState = { ...defaultState, cameras: [...control, ...subjects], category: subjectCategory };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      expectEqualItems(displayedCameras, subjects);
    });

    it('selectDisplayedCameras returns cameras filtered by level when state.levels is not empty', () => {
      const subjectLevels = [LEVEL.PROFESSIONAL, LEVEL.NON_PROFESSIONAL];
      const subjects = makeList(3, () => generateCamera({ level: getRandomArrayElement(subjectLevels) }));
      const control = makeList(3, () => generateCamera({ level: LEVEL.ZERO }));
      const state: CamerasState = { ...defaultState, cameras: [...control, ...subjects], levels: subjectLevels };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      expectEqualItems(displayedCameras, subjects);
    });

    it('selectDisplayedCameras returns cameras filtered by min price when state.priceMin was set', () => {
      const priceMin = 3000;
      const subjects = makeList(3, () => generateCamera({ price: intBetween(priceMin, priceMin * 2) }));
      const control = makeList(3, () => generateCamera({ price: intBetween(1, priceMin) }));
      const state: CamerasState = { ...defaultState, cameras: [...control, ...subjects], priceMin };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      expectEqualItems(displayedCameras, subjects);
    });

    it('selectDisplayedCameras returns cameras filtered by max price when state.priceMin was set', () => {
      const priceMax = 3000;
      const subjects = makeList(3, () => generateCamera({ price: intBetween(1, priceMax) }));
      const control = makeList(3, () => generateCamera({ price: intBetween(priceMax, priceMax * 2) }));
      const state: CamerasState = { ...defaultState, cameras: [...control, ...subjects], priceMax };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      expectEqualItems(displayedCameras, subjects);
    });

    it('selectDisplayedCameras returns cameras according to filters', () => {
      const priceMax = 10000;
      const priceMin = 3000;
      const subjectType = TYPE.COLLECTION;
      const subjectCategory = CATEGORY.PHOTO;
      const subjectLevel = LEVEL.NON_PROFESSIONAL;

      const makeSubject = () => generateCamera({
        price: intBetween(priceMin, priceMax),
        type: subjectType,
        category: subjectCategory,
        level: subjectLevel
      });

      const subjects = makeList(3, makeSubject);

      const control = [
        generateCamera({ price: intBetween(priceMax, priceMax * 2) }),
        generateCamera({ price: intBetween(1, priceMin) }),
        generateCamera({ price: intBetween(1, priceMin) }),
        generateCamera({ category: CATEGORY.VIDEO }),
        generateCamera({ type: TYPE.DIGITAL }),
        generateCamera({ level: LEVEL.PROFESSIONAL }),
      ];

      const state: CamerasState = {
        ...defaultState,
        priceMax,
        priceMin,
        types: [subjectType],
        category: subjectCategory,
        levels: [subjectLevel],
        cameras: [...control, ...subjects],
      };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      expectEqualItems(displayedCameras, subjects);
    });

    it('selectDisplayedCameras returns cameras sorted by price ascending when sortingKey is "price" and sorting order is ASC', () => {
      const cameras = makeList(10, () => generateCamera());
      const state: CamerasState = { ...defaultState, cameras, sortingKey: SortingKey.Price, sortingOrder: SortingOrder.ASC };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      displayedCameras.forEach((it, i, all) => {
        if (i > 0) {
          expect(it.price >= (all.at(i - 1) as Camera).price).toBe(true);
        }
      });
    });

    it('selectDisplayedCameras returns cameras sorted by price descending when sortingKey is "price" and sorting order is DSC', () => {
      const cameras = makeList(10, () => generateCamera());
      const state: CamerasState = { ...defaultState, cameras, sortingKey: SortingKey.Price, sortingOrder: SortingOrder.DESC };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      displayedCameras.forEach((it, i, all) => {
        if (i > 0) {
          expect(it.price <= (all.at(i - 1) as Camera).price).toBe(true);
        }
      });
    });

    it('selectDisplayedCameras returns cameras sorted by rating ascending when sortingKey is "rating" and sorting order is ASC', () => {
      const cameras = makeList(10, () => generateCamera());
      const state: CamerasState = { ...defaultState, cameras, sortingKey: SortingKey.Rating, sortingOrder: SortingOrder.ASC };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      displayedCameras.forEach((it, i, all) => {
        if (i > 0) {
          expect(it.rating >= (all.at(i - 1) as Camera).rating).toBe(true);
        }
      });
    });

    it('selectDisplayedCameras returns cameras sorted by price descending when sortingKey is "rating" and sorting order is DSC', () => {
      const cameras = makeList(10, () => generateCamera());
      const state: CamerasState = { ...defaultState, cameras, sortingKey: SortingKey.Rating, sortingOrder: SortingOrder.DESC };

      const displayedCameras = selectDisplayedCameras.unwrapped(state);

      displayedCameras.forEach((it, i, all) => {
        if (i > 0) {
          expect(it.rating <= (all.at(i - 1) as Camera).rating).toBe(true);
        }
      });
    });
  });
});
