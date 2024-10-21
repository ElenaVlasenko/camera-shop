import { ServerRoute } from '../const';
import { Camera, Promo } from '../types';
import api from './api';

const camerasApi = {
  async getList() {
    const { data } = await api.get<Camera[]>(ServerRoute.Cameras);
    return data;
  },

  async getPromo() {
    const { data } = await api.get<Promo[]>(ServerRoute.Promo);
    return data;
  },

  async getSimilar(id: Camera['id']): Promise<Camera[]> {
    const { data } = await api.get<Camera[]>(`${ServerRoute.Cameras}/${id}${ServerRoute.Similar}`);
    return data;
  }
} as const;

type CamerasApi = typeof camerasApi;

export {
  camerasApi
};

export type {
  CamerasApi
};
