import styles from './Card.module.css';

/**
 * @param {string | ReactNode} icon        — emoji or SVG/component
 * @param {string}             title
 * @param {string}             description
 * @param {string}             className   — extra classes
 */
export default function Card({ icon, title, description, className = '', children }) {
  return (
    <div className={`${styles.card} ${className}`}>
      {icon && (
        <div className={styles.iconWrapper} aria-hidden="true">
          {icon}
        </div>
      )}
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {children}
    </div>
  );
}
