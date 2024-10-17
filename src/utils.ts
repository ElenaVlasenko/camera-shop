import { Camera } from './types';

export const hasId = (id?: Camera['id']) => (camera: Camera) => id === camera.id;
export const isEmpty = <T>(list: T[]) => list.length === 0;
