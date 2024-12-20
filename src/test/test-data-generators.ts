import { CATEGORY, LEVEL, TYPE } from '../const';
import { Camera, OrderParams, Review } from '../types';
import { getRandomArrayElement, getIntBetween, makeCounter, makeList, makeUniqStringGenerator } from './utils';

const generateUniqCameraName = makeUniqStringGenerator((n) => `camera-name-${n}`);
const generateUniqVendorCode = makeUniqStringGenerator((n) => `vendor-code-${n}`);
const generateType = () => getRandomArrayElement(Object.values(TYPE));
const generateCategory = () => getRandomArrayElement(Object.values(CATEGORY));
const generateDescription = makeUniqStringGenerator((n) => `description-${n}`);
const generateLevel = () => getRandomArrayElement(Object.values(LEVEL));
const generatePreviewImg = makeUniqStringGenerator((n) => `camera-preview-imj-${n}.jpeg`);
const generatePreviewImg2x = makeUniqStringGenerator((n) => `camera-preview-imj-2x-${n}.jpeg`);
const generatePreviewImgWebp = makeUniqStringGenerator((n) => `camera-preview-imj-${n}.webp`);
const generatePreviewImgWebp2x = makeUniqStringGenerator((n) => `camera-preview-imj-2x-${n}.webp`);

const getNextSerial = makeCounter(1);

export const generateCamera = (params: Partial<Camera> = {}): Camera => {
  const id = getNextSerial();
  return ({
    id,
    name: generateUniqCameraName(id),
    vendorCode: generateUniqVendorCode(id),
    type: generateType(),
    category: generateCategory(),
    description: generateDescription(id),
    level: generateLevel(),
    price: getIntBetween(1000, 200000),
    rating: getIntBetween(1, 5),
    reviewCount: getIntBetween(0, 10),
    previewImg: generatePreviewImg(id),
    previewImg2x: generatePreviewImg2x(id),
    previewImgWebp: generatePreviewImgWebp(),
    previewImgWebp2x: generatePreviewImgWebp2x(id),
    ...params,
  });
};

const generateUniqUserName = makeUniqStringGenerator((n) => `user-name-${n}`);
const generateUniqAdvantage = makeUniqStringGenerator((n) => `advantage-${n}`);
const generateUniqDisadvantage = makeUniqStringGenerator((n) => `disadvantage-${n}`);
const generateUniqReview = makeUniqStringGenerator((n) => `review-${n}`);

export const generateReview = (params: Partial<Review> = {}): Review => {
  const id = getNextSerial();
  const cameraId = getNextSerial();

  return ({
    id,
    createAt: new Date().toISOString(),
    cameraId,
    userName: generateUniqUserName(id),
    advantage: generateUniqAdvantage(id),
    disadvantage: generateUniqDisadvantage(id),
    review: generateUniqReview(id),
    rating: getIntBetween(1, 5),
    ...params,
  });
};

export const generateOrder = (params: Partial<OrderParams> = {}): OrderParams => ({
  camerasIds: makeList(getIntBetween(1, 10), () => getNextSerial()),
  coupon: null,
  ...params,
});

