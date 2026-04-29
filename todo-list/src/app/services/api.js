/* =============================================================
   API CLIENT — Базовий HTTP-клієнт для запитів до бекенду
   -------------------------------------------------------------
   Обгортка над fetch з автоматичним додаванням JWT токена,
   обробкою помилок та базовим URL.

   USAGE:
     import api from '@/app/services/api';
     const data = await api.get('/todos');
     const result = await api.post('/todos', { text: 'New task' });
   ============================================================= */

import { getToken } from '@/app/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Базовий fetch-запит з авторизацією та обробкою помилок.
 * @param {string} endpoint — шлях API (наприклад '/auth/login')
 * @param {RequestInit} [options] — додаткові параметри fetch
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Якщо відповідь не OK — кидаємо помилку з повідомленням від бекенду
  if (!response.ok) {
    /** @type {import('@/app/types/auth').ApiError} */
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Помилка запиту: ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // 204 No Content — повертаємо null
  if (response.status === 204) return null;

  return response.json();
}

// ─── Зручні методи ───────────────────────────────────────────

const api = {
  /**
   * GET запит
   * @param {string} endpoint
   * @returns {Promise<any>}
   */
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  /**
   * POST запит
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<any>}
   */
  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * PUT запит
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<any>}
   */
  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  /**
   * PATCH запит
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<any>}
   */
  patch: (endpoint, body) =>
    request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  /**
   * DELETE запит
   * @param {string} endpoint
   * @returns {Promise<any>}
   */
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
