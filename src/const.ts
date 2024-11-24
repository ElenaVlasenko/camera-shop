export enum AppRoute {
  Main = '/',
  Cameras = '/cameras',
  Id = ':id',
}

export enum PageRoute {
  Main = AppRoute.Main,
  Cameras = AppRoute.Cameras,
  Camera = `${AppRoute.Cameras}/${AppRoute.Id}`,
}

export enum ServerRoute {
  Cameras = '/cameras',
  Similar = '/similar',
  Promo = '/promo',
  Reviews = '/reviews',
  Coupons = '/coupons',
  Orders = '/orders',
}

export const DISPLAYED_REVIEWS_NUMBER_STEP = 3;

export const DEFAULT_SIMILAR_COUNT = 3;

export const PHONE_DIGITS_LENGTH = 9;
export const KEYCODE_TAB = 'Tab';
export const KEYCODE_UP = 'ArrowUp';
export const KEYCODE_DOWN = 'ArrowDown';

export enum SortingKey {
  Price = 'price',
  Rating = 'rating'
}

export enum SortingOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export const CATEGORY = {
  VIDEO: 'Видеокамера',
  PHOTO: 'Фотоаппарат',
} as const;

export type Category = typeof CATEGORY[keyof typeof CATEGORY];

export const TYPE = {
  COLLECTION: 'Коллекционная',
  SNAPSHOT: 'Моментальная',
  DIGITAL: 'Цифровая',
  FILM: 'Плёночная'
} as const;

export type Type = typeof TYPE[keyof typeof TYPE];

export const LEVEL = {
  ZERO: 'Нулевой',
  NON_PROFESSIONAL: 'Любительский',
  PROFESSIONAL: 'Профессиональный',
} as const;

export type Level = typeof LEVEL[keyof typeof LEVEL];

export const MAX_DISPLAYED_CAMERAS_COUNT = 9;
export const PAGINATION_PAGE_NUMBER = 3;
