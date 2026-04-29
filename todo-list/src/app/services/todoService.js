/* =============================================================
   TODO SERVICE — HTTP-запити для задач
   ============================================================= */

import api from './api';

export const todoService = {
  getAll: () => api.get('/todos'),
  
  /**
   * Створити нову задачу.
   * @param {{ text: string, description?: string, priority: string }} taskData
   */
  create: (taskData) => api.post('/todos', taskData),
  
  update: (id, updates) => api.patch(`/todos/${id}`, updates),
  delete: (id) => api.delete(`/todos/${id}`),
};
