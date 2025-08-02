// src/api/auth.ts
import axios from 'axios';
import { baseUrl } from '../config';

const API = axios.create({
  baseURL: baseUrl,
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
    export const getSpace = (id:string,token:string) =>
  API.get(`/spaces/${id}`,{
    headers:{
        Authorization:`Bearer ${token}`
    }
  });

export const updateSpace = (id: string, content: string, token: string) =>
  API.put(`/spaces/${id}/content`, 
    { content }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const inviteUser = async (spaceId: string, email: string, token: string) => {
  return API.post(
    `/invites/${spaceId}`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};