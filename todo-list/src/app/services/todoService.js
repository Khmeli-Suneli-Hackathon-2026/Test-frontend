import { api } from './api';

export const todoService = {
  /**
   * Отримати всі завдання
   */
  getAll: async () => {
    return api.get('/todos');
  },

  /**
   * Створити нове завдання
   */
  create: async (todoData) => {
    return api.post('/todos', todoData);
  },

  /**
   * Оновити завдання (статус, текст тощо)
   */
  update: async (id, updates) => {
    return api.patch(`/todos/${id}`, updates);
  },

  /**
   * Видалити завдання
   */
  delete: async (id) => {
    return api.delete(`/todos/${id}`);
  },
};
