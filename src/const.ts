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
