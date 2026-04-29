/* =============================================================
   SELECT — Template Component
   -------------------------------------------------------------
   USAGE:
     import Select from '@/app/components/Select/Select';

     <Select label="Priority" options={[
       { value: 'low', label: 'Low' },
       { value: 'medium', label: 'Medium' },
       { value: 'high', label: 'High' },
     ]} />
   ============================================================= */

'use client';
import styles from './Select.module.css';

/**
 * @param {string}  label       — field label
 * @param {string}  hint        — helper text below select
 * @param {string}  error       — error message (overrides hint, turns border red)
 * @param {boolean} disabled
 * @param {string}  id          — unique id (linked to label)
 * @param {Array<{ value: string, label: string }>} options
 * @param {string}  placeholder — placeholder option text
 */
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
          aria-describedby={hint || error ? `${selectId}-hint` : undefined}
          aria-invalid={!!error}
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
          ▾
        </span>
      </div>
      {(hint || error) && (
        <span
          id={`${selectId}-hint`}
          className={error ? styles.hintError : styles.hint}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}
