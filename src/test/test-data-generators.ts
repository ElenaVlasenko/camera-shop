import { Camera, OrderParams, Review } from '../types';
import { intBetween, makeCounter, makeList, makeUniqStringGenerator } from './utils';

const generateUniqCameraName = makeUniqStringGenerator((n) => `camera-name-${n}`);
const generateUniqVendorCode = makeUniqStringGenerator((n) => `vendor-code-${n}`);
const generateUniqType = makeUniqStringGenerator((n) => `type-${n}`);
const generateCategory = makeUniqStringGenerator((n) => `category-${n}`);
const generateDescription = makeUniqStringGenerator((n) => `description-${n}`);
const generateLevel = makeUniqStringGenerator((n) => `level-${n}`);
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
    type: generateUniqType(id),
    category: generateCategory(id),
    description: generateDescription(id),
    level: generateLevel(id),
    price: intBetween(1000, 200000),
    rating: intBetween(1, 5),
    reviewCount: intBetween(0, 10),
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
    rating: intBetween(1, 5),
    ...params,
  });
};

export const generateOrder = (params: Partial<OrderParams> = {}): OrderParams => ({
  camerasIds: makeList(intBetween(1, 10), () => getNextSerial()),
  coupon: null,
  tel: `+79${intBetween(100_000_000, 99_999_999).toString()}`,
  ...params,
});

