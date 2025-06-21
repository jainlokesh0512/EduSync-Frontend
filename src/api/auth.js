import api from './axios';

export const login = (credentials) => api.post('/Auth/login', credentials);
export const register = (user) => api.post('/Auth/register', user);
