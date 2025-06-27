import { api } from './client';
export type Air = { aqi: number; pm25: number; pm10: number };
export const getAir = () => api.get<Air>('/air/latest/').then(r => r.data);