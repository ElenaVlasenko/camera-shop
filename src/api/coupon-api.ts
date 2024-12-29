import { ServerRoute } from '../const';
import api from './api';

const couponApi = {
  async check(coupon: string): Promise<number> {
    const { data } = await api.post<string>(ServerRoute.Coupons, { coupon });
    return parseInt(data, 10);
  },
};

type CouponApi = typeof couponApi;

export {
  couponApi,
};

export type {
  CouponApi,
};
