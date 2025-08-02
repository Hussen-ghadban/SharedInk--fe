// src/api/auth.ts
import axios from 'axios';
import { baseUrl } from '../config';

const API = axios.create({
  baseURL: baseUrl, // change if needed
//   withCredentials: true, // if using cookies
});

export const signup = (data: { username: string; email: string; password: string }) =>
  API.post('/auth/signup', data);

export const signin = (data: { email: string; password: string }) =>
  API.post('/auth/signin', data);
