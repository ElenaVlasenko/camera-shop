import { ServerRoute } from '../const';
import { Camera, ReviewParams, Review } from '../types';
import api from './api';

const reviewsApi = {
  async getList(id: Camera['id']): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`${ServerRoute.Cameras}/${id}${ServerRoute.Reviews}`);
    return data;
  },

  async addReview(params: ReviewParams): Promise<Review> {
    const { data } = await api.post<Review>(`${ServerRoute.Reviews}`, params);
    return data;
  }
} as const;

type ReviewsApi = typeof reviewsApi;

export {
  reviewsApi,
};

export type {
  ReviewsApi,
};
