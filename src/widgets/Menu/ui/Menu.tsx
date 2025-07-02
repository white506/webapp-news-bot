import React from 'react';
import styles from './Menu.module.scss';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

interface MenuProps {
  className?: string;
}

const menuItems: MenuItem[] = [
  { id: 'profile', icon: '👤', label: 'Личный кабинет' },
  { id: 'settings', icon: '⚙️', label: 'Настройки' },
  { id: 'share', icon: '📤', label: 'Поделиться' },
];

export const Menu: React.FC<MenuProps> = ({ className = '' }) => {
  return (
    <nav className={`${styles.menu} ${className}`}>
      <ul className={styles.menu__list}>
        {menuItems.map((item) => (
          <li key={item.id} className={styles.menu__item}>
            <div className={styles.menu__button}>
              <span className={styles.menu__icon}>{item.icon}</span>
              <span className={styles.menu__label}>{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu; 