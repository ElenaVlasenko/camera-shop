import { ServerRoute } from '../const';
import { OrderParams } from '../types';
import api from './api';

const orderApi = {
  async addOrder(order: OrderParams): Promise<void> {
    await api.post<void>(ServerRoute.Orders, order);
  },
};

type OrderApi = typeof orderApi;

export {
  orderApi,
};

export type {
  OrderApi,
};
