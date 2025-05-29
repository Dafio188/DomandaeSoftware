import axios from 'axios';
import { API_BASE } from '../config/api.js';

export async function getRichiesteCliente(token) {
  return axios.get(`${API_BASE}richieste/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export async function getProgettiCliente(token, userId) {
  return axios.get(`${API_BASE}progetti/?cliente=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export async function getOfferteFornitore(token, userId) {
  return axios.get(`${API_BASE}offerte/?fornitore=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export async function getProgettiFornitore(token, userId) {
  return axios.get(`${API_BASE}progetti/?fornitore=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export async function getUtenti(token) {
  return axios.get(`${API_BASE}auth/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export async function getUtentiAdmin(token) {
  return axios.get(`${API_BASE}auth/users/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export async function getAllRichieste(token) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return axios.get(`${API_BASE}richieste/`, {
    headers: headers,
  }).then(res => res.data);
}

export async function getAllOfferte(token) {
  return axios.get(`${API_BASE}offerte/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export async function getAllProgetti(token) {
  return axios.get(`${API_BASE}progetti/`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

export async function getOfferteCliente(token, userId) {
  return axios.get(`${API_BASE}offerte/?cliente=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

// Funzione per acquistare un prodotto
export async function acquistaProdotto(token, prodottoId) {
  return axios.post(`${API_BASE}prodotti-pronti/${prodottoId}/acquista/`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

// Altre funzioni per admin/statistiche possono essere aggiunte qui 