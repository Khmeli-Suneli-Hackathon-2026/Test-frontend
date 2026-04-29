'use client';

import { useState } from 'react';
import Button from './Button/Button';
import Input from './Input/Input';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { handleLogin, loading, error: apiError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Введіть email';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Невірний формат email';
    if (!password) newErrors.password = 'Введіть пароль';
    else if (password.length < 6) newErrors.password = 'Мінімум 6 символів';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }
    setErrors({});
    clearError();

    const ok = await handleLogin(email, password);
    if (ok) {
      setSuccess(true);
      // Редирект відбувається автоматично через useAuth
    }
  };

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href="/" className={styles.logo}>
            <span className={styles.logoText}>ToDo List</span>
          </a>
          <Button href="/register" variant="secondary" size="medium">
            Реєстрація
          </Button>
        </div>
      </header>

      {/* Center content */}
      <div className={styles.center}>
        <div className={styles.card}>
          {/* Icon */}
          <div className={styles.iconBadge} aria-hidden="true">🔐</div>

          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Вхід в акаунт</h1>
            <p className={styles.subtitle}>Введіть дані, щоб продовжити роботу</p>
          </div>

          {success ? (
            <div className={styles.successBox}>
              <span className={styles.successIcon}></span>
              <h2>Успішний вхід!</h2>
              <p>Перенаправляємо вас на головну сторінку...</p>
              <Button href="/" size="medium">На головну</Button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {apiError && (
                <div className={styles.apiError} role="alert">
                  {apiError}
                </div>
              )}

              <Input
                id="login-email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                error={errors.email}
              />

              <Input
                id="login-password"
                label="Пароль"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={errors.password}
              />

              <Button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? 'Входимо...' : 'Увійти'}
              </Button>
            </form>
          )}

          {!success && (
            <p className={styles.registerHint}>
              Немає акаунту?{' '}
              <a href="/register" className={styles.registerLink}>Зареєструватись</a>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
