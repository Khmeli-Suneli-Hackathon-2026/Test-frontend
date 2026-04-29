'use client';
import { IconChevronDown } from '../Icons';
import styles from './Select.module.css';

export default function Select({
  label,
  hint,
  error,
  disabled = false,
  id,
  options = [],
  placeholder = 'Оберіть...',
  className = '',
  value,
  ...props
}) {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.selectContainer}>
        <select
          id={selectId}
          disabled={disabled}
          value={value}
          className={[
            styles.select,
            error    ? styles.selectError    : '',
            disabled ? styles.selectDisabled : '',
          ].filter(Boolean).join(' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow} aria-hidden="true">
          <IconChevronDown />
        </span>
      </div>
      {(hint || error) && (
        <span className={error ? styles.hintError : styles.hint}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
