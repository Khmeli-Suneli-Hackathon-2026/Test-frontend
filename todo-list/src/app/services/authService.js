/* =============================================================
   AUTH SERVICE — HTTP-запити для автентифікації
   -------------------------------------------------------------
   Модуль для роботи з ендпоінтами авторизації бекенду.

   USAGE:
     import { authService } from '@/app/services/authService';
     const data = await authService.login('email@example.com', 'password');
   ============================================================= */

import api from './api';

/**
 * @typedef {import('@/app/types/auth').AuthResponse} AuthResponse
 * @typedef {import('@/app/types/auth').LoginRequest} LoginRequest
 * @typedef {import('@/app/types/auth').RegisterRequest} RegisterRequest
 */

export const authService = {
  /**
   * Вхід — відправляє email та пароль, отримує JWT токен.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<AuthResponse>}
   */
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  /**
   * Реєстрація — відправляє дані нового користувача.
   * @param {RegisterRequest} userData
   * @returns {Promise<AuthResponse>}
   */
  register: (userData) =>
    api.post('/auth/register', userData),

  /**
   * Отримати поточного користувача по JWT токену.
   * @returns {Promise<import('@/app/types/auth').User>}
   */
  getMe: () =>
    api.get('/auth/me'),
};
