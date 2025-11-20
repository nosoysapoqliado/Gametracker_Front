import { API_URL } from '../config/api';

const checkResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  return res.json().catch(() => null);
};

export const gameService = {
  getAllGames: async (baseUrl = API_URL) => {
    const res = await fetch(baseUrl);
    return checkResponse(res);
  },

  searchGames: async (searchTerm, baseUrl = API_URL) => {
    // Si el backend no soporta query, hacemos filtro en el cliente
    const all = await gameService.getAllGames(baseUrl);
    if (!searchTerm) return all;
    const q = searchTerm.toLowerCase();
    return all.filter(g =>
      (g.name || g.title || '').toLowerCase().includes(q) ||
      (g.category || g.genre || '').toLowerCase().includes(q)
    );
  },

  createGame: async (payload, baseUrl = API_URL) => {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return checkResponse(res);
  },

  updateGame: async (id, payload, baseUrl = API_URL) => {
    const res = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return checkResponse(res);
  },

  deleteGame: async (id, baseUrl = API_URL) => {
    const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    if (res.status === 204) return null;
    return checkResponse(res);
  }
};
