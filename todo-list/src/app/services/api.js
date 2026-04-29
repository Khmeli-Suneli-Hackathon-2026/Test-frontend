import axios from 'axios';
import { getToken } from '../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Створюємо екземпляр axios з базовими налаштуваннями
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Інтерцептор для запитів: автоматично додає Authorization заголовок
 */
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Інтерцептор для відповідей: централізована обробка помилок
 */
api.interceptors.response.use(
  (response) => {
    // Axios повертає дані у полі .data
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Щось пішло не так';
    
    if (error.response?.status === 401) {
      console.warn('⚠️ Сесія завершена або токен невалідний');
      // Тут можна додати автоматичний logout або редирект
    }

    console.error('❌ API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export { api };
