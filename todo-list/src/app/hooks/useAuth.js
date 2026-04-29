/* =============================================================
   useAuth — Кастомний хук для управління авторизацією
   -------------------------------------------------------------
   Надає зручний інтерфейс для логіну, реєстрації, логауту
   та перевірки стану авторизації у будь-якому компоненті.

   USAGE:
     import { useAuth } from '@/app/hooks/useAuth';

     function MyComponent() {
       const { isLoggedIn, user, handleLogin, handleLogout, loading, error } = useAuth();
     }
   ============================================================= */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { saveToken, getToken, removeToken, isAuthenticated } from '@/app/lib/auth';
import { authService } from '@/app/services/authService';

/**
 * @returns {{
 *   isLoggedIn: boolean,
 *   user: import('@/app/types/auth').User | null,
 *   loading: boolean,
 *   error: string,
 *   handleLogin: (email: string, password: string) => Promise<boolean>,
 *   handleRegister: (userData: import('@/app/types/auth').RegisterRequest) => Promise<boolean>,
 *   handleLogout: () => void,
 *   clearError: () => void,
 * }}
 */
export function useAuth() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Перевірка авторизації при маунті компонента
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  /**
   * Вхід — відправляє дані на бекенд, зберігає токен, редиректить.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>} — true якщо успішно
   */
  const handleLogin = useCallback(async (email, password) => {
    setLoading(true);
    setError('');

    try {
      /** @type {import('@/app/types/auth').AuthResponse} */
      const data = await authService.login(email, password);

      // Зберігаємо JWT токен в cookies
      saveToken(data.token);
      setIsLoggedIn(true);
      setUser(data.user || null);
      setLoading(false);

      // Редирект на головну сторінку
      setTimeout(() => {
        router.push('/');
      }, 1500);

      return true;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Помилка входу. Спробуйте ще раз.');
      return false;
    }
  }, [router]);

  /**
   * Реєстрація — створює акаунт, зберігає токен, редиректить.
   * @param {import('@/app/types/auth').RegisterRequest} userData
   * @returns {Promise<boolean>}
   */
  const handleRegister = useCallback(async (userData) => {
    setLoading(true);
    setError('');

    try {
      /** @type {import('@/app/types/auth').AuthResponse} */
      const data = await authService.register(userData);

      saveToken(data.token);
      setIsLoggedIn(true);
      setUser(data.user || null);
      setLoading(false);

      setTimeout(() => {
        router.push('/');
      }, 1500);

      return true;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Помилка реєстрації. Спробуйте ще раз.');
      return false;
    }
  }, [router]);

  /**
   * Вихід — видаляє токен, редиректить на сторінку логіну.
   */
  const handleLogout = useCallback(() => {
    removeToken();
    setIsLoggedIn(false);
    setUser(null);
    router.push('/login');
  }, [router]);

  /**
   * Очистити помилку.
   */
  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    isLoggedIn,
    user,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    clearError,
  };
}
