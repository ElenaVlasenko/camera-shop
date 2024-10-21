import { Camera } from '../../types';

export const makeBuyButtonTestId = (id: Camera['id']) => `camera-list-item-buy-button-${id}`;
export const makeInfoButtonTestId = (id: Camera['id']) => `camera-info-button-${id}`;
