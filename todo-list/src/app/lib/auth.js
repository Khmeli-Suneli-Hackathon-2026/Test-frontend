/* =============================================================
   AUTH — JWT Token Management Utilities
   ============================================================= */

const TOKEN_KEY = 'jwt_token';

export function getToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + TOKEN_KEY + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function saveToken(token) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${secure}`;
}

export function removeToken() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function isAuthenticated() {
  return !!getToken();
}
