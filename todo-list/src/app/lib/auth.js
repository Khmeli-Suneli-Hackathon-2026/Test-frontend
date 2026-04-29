/* =============================================================
   AUTH — JWT Token Management (Cookies)
   -------------------------------------------------------------
   Низькорівневі утиліти для роботи з JWT токеном у cookies.
   Для HTTP-запитів використовуй services/authService.js
   Для React-компонентів використовуй hooks/useAuth.js

   USAGE:
     import { saveToken, getToken, removeToken } from '@/app/lib/auth';
   ============================================================= */

const TOKEN_KEY = 'jwt_token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Зберегти JWT токен в cookies.
 * @param {string} token
 */
export function saveToken(token) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
}

/**
 * Отримати JWT токен з cookies.
 * @returns {string|null}
 */
export function getToken() {
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + TOKEN_KEY + '=([^;]*)')
  );
  if (match) return decodeURIComponent(match[1]);
  return null;
}

/**
 * Видалити JWT токен з cookies.
 */
export function removeToken() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

/**
 * Перевірити чи користувач авторизований.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getToken();
}
