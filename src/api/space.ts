// src/api/auth.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

export const addSpace = (data: { title: string},token:string) =>
  API.post('/spaces', data,{
    headers:{
        Authorization:`Bearer ${token}`
    }
  });

  export const getSpaces = (token:string) =>
  API.get('/spaces',{
    headers:{
        Authorization:`Bearer ${token}`
    }
  });
