import { ServerRoute } from '../const';
import { Camera, Promo } from '../types';
import api from './api';

const camerasApi = {
  async getList() {
    const { data } = await api.get<Camera[]>(ServerRoute.Cameras);
    // console.log('data:', data)
    return data;
  },

  async getCamera(id: string) {
    const { data } = await api.get<Camera>(`${ServerRoute.Cameras}/${id}`);
    return data;
  },

  async getPromo() {
    const { data } = await api.get<Promo[]>(ServerRoute.Promo);
    // console.log('data:', data)
    return data;
  },
} as const;

type CamerasApi = typeof camerasApi;

export {
  camerasApi
};

export type {
  CamerasApi
};
