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

  export const getuser = (token:string) =>
    API.get('/auth/get-user',{
      headers:{
          Authorization:`Bearer ${token}`
      }
  });
export const uploadProfileImage = (formData: FormData, token: string) =>
  API.post('/auth/upload-profile', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    }
  });