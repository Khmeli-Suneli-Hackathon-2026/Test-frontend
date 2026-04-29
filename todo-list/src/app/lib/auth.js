/* =============================================================
   AUTH — JWT Token Management Utilities
   -------------------------------------------------------------
   Handles saving, retrieving, and removing JWT tokens using
   cookies (primary) with localStorage fallback.

   USAGE:
     import { saveToken, getToken, removeToken, login } from '@/app/lib/auth';
   ============================================================= */

const TOKEN_KEY = 'jwt_token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// ─── Cookie helpers ───────────────────────────────────────────

/**
 * Save JWT token to cookies.
 */
export function saveToken(token) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
}

/**
 * Retrieve JWT token from cookies.
 */
export function getToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + TOKEN_KEY + '=([^;]*)')
  );
  if (match) return decodeURIComponent(match[1]);
  return null;
}

/**
 * Remove JWT token from cookies.
 */
export function removeToken() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

/**
 * Check if the user is currently authenticated.
 */
export function isAuthenticated() {
  return !!getToken();
}

// ─── API helpers ──────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Login — sends credentials to backend and returns the JWT token.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user?: object }>}
 */
export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Помилка входу. Спробуйте ще раз.');
  }

  const data = await response.json();
  return data; // expects { token, user? }
}

/**
 * Register — sends registration data to backend.
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<{ token: string, user?: object }>}
 */
export async function register(userData) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Помилка реєстрації. Спробуйте ще раз.');
  }

  const data = await response.json();
  return data; // expects { token, user? }
}

/**
 * Create an Authorization header with the stored JWT token.
 * Use this for authenticated API requests.
 */
export function authHeaders() {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
