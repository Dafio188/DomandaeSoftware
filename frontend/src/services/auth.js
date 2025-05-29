import axios from 'axios';

const API_URL = '/api/auth/';

export async function login(username, password) {
  const response = await axios.post(`${API_URL}login/`, {
    username,
    password,
  });
  return response.data; // { access, refresh }
}

export async function getProfile(token) {
  const response = await axios.get(`${API_URL}profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data; // { id, username, email, ruolo, ... }
}
