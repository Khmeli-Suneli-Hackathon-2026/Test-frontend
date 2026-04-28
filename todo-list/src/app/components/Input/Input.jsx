/* =============================================================
   INPUT — Template Component
   -------------------------------------------------------------
   USAGE:
     import Input from '@/templates/components/Input/Input';

     <Input label="Email" placeholder="you@example.com" />
     <Input label="Password" type="password" hint="Min 8 chars" />
     <Input label="Name" error="This field is required" />
     <Input label="Disabled" disabled />
   ============================================================= */

'use client';
import styles from './Input.module.css';

/**
 * @param {string}  label       — field label
 * @param {string}  hint        — helper text below input
 * @param {string}  error       — error message (overrides hint, turns border red)
 * @param {string}  type        — input type (text, email, password, etc.)
 * @param {boolean} disabled
 * @param {string}  placeholder
 * @param {string}  id          — unique id (linked to label)
 */
export default function Input({
  label,
  hint,
  error,
  type = 'text',
  disabled = false,
  placeholder = '',
  id,
  className = '',
  ...props
}) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          styles.input,
          error   ? styles.inputError    : '',
          disabled? styles.inputDisabled : '',
        ].filter(Boolean).join(' ')}
        aria-describedby={hint || error ? `${inputId}-hint` : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {(hint || error) && (
        <span
          id={`${inputId}-hint`}
          className={error ? styles.hintError : styles.hint}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}
