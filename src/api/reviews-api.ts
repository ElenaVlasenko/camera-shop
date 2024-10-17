import { ServerRoute } from '../const';
import { Camera, Review } from '../types';
import api from './api';

const reviewsApi = {

  async getList(id: Camera['id']): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`${ServerRoute.Cameras}/${id}${ServerRoute.Reviews}`);
    return data;
  },
  // async sendComment({ comment, id, rating }: UserComment):Promise<Comment> {
  //   const { data } = await api.post<Comment>(`${ServerRoute.Comments}/${id}`, { comment, rating });
  //   return data;
  // }
} as const;

type ReviewsApi = typeof reviewsApi;

export {
  reviewsApi,
};

export type {
  ReviewsApi,
};
