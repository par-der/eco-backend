import { api } from './client';
export type Weather = { temperature: number; humidity: number; wind_speed: number };
export const getWeather = () => api.get<Weather>('/weather').then(r => r.data);