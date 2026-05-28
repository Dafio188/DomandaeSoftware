import axios from 'axios';
import { API_BASE } from '../config/api.js';

const API_URL = `${API_BASE}auth/`;

export async function login(username, password) {
  const response = await axios.post(`${API_URL}login/`, {
    username,
    password,
  });
  return response.data; // { access, refresh }
}

export async function register(userData) {
  const response = await axios.post(`${API_URL}register/`, userData);
  return response.data;
}

export async function getProfile(token) {
  const response = await axios.get(`${API_URL}profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // { id, username, email, ruolo, ... }
}

export async function googleLogin(token, ruolo = 'cliente') {
  const response = await axios.post(`${API_URL}google/`, {
    token,
    ruolo
  });
  return response.data; // { token, refresh, user }
}
