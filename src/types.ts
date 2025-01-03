import { Category, Level, Type } from './const';

export type Camera = {
  id: number;
  name: string;
  vendorCode: string;
  type: Type;
  category: Category;
  description: string;
  level: Level;
  price: number;
  rating: number;
  reviewCount: number;
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
}

export type Review = {
  id: number;
  createAt: string;
  cameraId: number;
  userName: string;
  advantage: string;
  disadvantage: string;
  review: string;
  rating: number;
}

export type OrderParams = {
  camerasIds: number[];
  coupon: string | null;
}

export type Promo = {
  id: number;
  name: string;
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
}

export type CameraCounts = { [cameraId: number]: number };

export type ReviewParams = {
  cameraId: number;
  userName: string;
  advantage: string;
  disadvantage: string;
  review: string;
  rating: number;
}
