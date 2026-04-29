/* =============================================================
   TODO SERVICE — HTTP-запити для задач
   -------------------------------------------------------------
   Модуль для CRUD-операцій із задачами на бекенді.

   USAGE:
     import { todoService } from '@/app/services/todoService';
     const todos = await todoService.getAll();
   ============================================================= */

import api from './api';

/**
 * @typedef {import('@/app/types/auth').Todo} Todo
 */

export const todoService = {
  /**
   * Отримати всі задачі поточного користувача.
   * @returns {Promise<Todo[]>}
   */
  getAll: () =>
    api.get('/todos'),

  /**
   * Створити нову задачу.
   * @param {string} text — текст задачі
   * @returns {Promise<Todo>}
   */
  create: (text) =>
    api.post('/todos', { text }),

  /**
   * Оновити задачу (наприклад, змінити статус done).
   * @param {string|number} id
   * @param {Partial<Todo>} updates
   * @returns {Promise<Todo>}
   */
  update: (id, updates) =>
    api.patch(`/todos/${id}`, updates),

  /**
   * Видалити задачу.
   * @param {string|number} id
   * @returns {Promise<null>}
   */
  delete: (id) =>
    api.delete(`/todos/${id}`),
};
