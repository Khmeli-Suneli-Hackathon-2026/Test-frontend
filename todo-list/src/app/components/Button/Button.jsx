/* =============================================================
   BUTTON — Template Component
   -------------------------------------------------------------
   USAGE:
     import Button from '@/templates/components/Button/Button';

     <Button>Label</Button>
     <Button variant="secondary" size="medium">Label</Button>
     <Button variant="tertiary" disabled>Label</Button>
     <Button href="/page">Link-style button</Button>
   ============================================================= */

'use client';
import styles from './Button.module.css';

/**
 * @param {'primary' | 'secondary' | 'tertiary' | 'link'} variant
 * @param {'normal' | 'medium' | 'small'} size
 * @param {boolean} disabled
 * @param {string}  href       — if provided, renders <a> instead of <button>
 * @param {string}  className  — extra classes
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'normal',
  disabled = false,
  href,
  className = '',
  onClick,
  id,
  type = 'button',
  ...props
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <a href={href} className={cls} id={id} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      id={id}
      {...props}
    >
      {children}
    </button>
  );
}
