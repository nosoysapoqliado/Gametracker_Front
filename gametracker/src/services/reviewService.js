import { REVIEWS_URL } from '../config/api';

const checkResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  // DELETE 204 no content
  if (res.status === 204) return null;
  return res.json().catch(() => null);
};

export const reviewService = {
  getByGameId: async (juegoId, baseUrl = REVIEWS_URL) => {
    const res = await fetch(`${baseUrl}/juego/${juegoId}`);
    return checkResponse(res);
  },
  create: async (payload, baseUrl = REVIEWS_URL) => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return checkResponse(res);
  },
  update: async (id, payload, baseUrl = REVIEWS_URL) => {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return checkResponse(res);
  },
  remove: async (id, baseUrl = REVIEWS_URL) => {
    const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    return checkResponse(res);
  }
};