// src/api/auth.ts
import axios from 'axios';
import { baseUrl } from '../config';

const API = axios.create({
  baseURL: baseUrl,
});

  export const getInvitations  = (token:string) =>
  API.get('/invites',{
    headers:{
        Authorization:`Bearer ${token}`
    }
  });
// Accept an invitation
export const acceptInvitation = (id: string, token: string) =>
  API.post(`/invites/${id}/accept`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Reject an invitation
export const rejectInvitation = (id: string, token: string) =>
  API.put(`/invites/${id}/reject`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
