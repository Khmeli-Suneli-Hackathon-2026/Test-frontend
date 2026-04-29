/* =============================================================
   AUTH TYPES — Інтерфейси для типізації відповідей від бекенду
   -------------------------------------------------------------
   Використовуємо JSDoc typedefs для типізації без TypeScript.

   USAGE:
     /** @type {import('@/app/types/auth').LoginRequest} */

// ─── Request types ────────────────────────────────────────────

/**
 * @typedef {Object} LoginRequest
 * @property {string} email    — Email користувача
 * @property {string} password — Пароль
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} name     — Ім'я користувача
 * @property {string} email    — Email
 * @property {string} password — Пароль
 */

// ─── Response types ───────────────────────────────────────────

/**
 * @typedef {Object} User
 * @property {string|number} id    — ID користувача
 * @property {string}        name  — Ім'я
 * @property {string}        email — Email
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token — JWT токен
 * @property {User}   [user] — Дані користувача (опціонально)
 */

/**
 * @typedef {Object} ApiError
 * @property {string}  message    — Повідомлення помилки
 * @property {number}  [status]   — HTTP статус код
 * @property {Object}  [errors]   — Детальні помилки валідації
 */

// ─── Todo types ───────────────────────────────────────────────

/**
 * @typedef {Object} Todo
 * @property {string|number} id        — ID задачі
 * @property {string}        text      — Текст задачі
 * @property {boolean}       done      — Статус виконання
 * @property {string}        [createdAt] — Дата створення
 */

/**
 * @typedef {Object} TodoListResponse
 * @property {Todo[]} todos — Масив задач
 */

export { };
