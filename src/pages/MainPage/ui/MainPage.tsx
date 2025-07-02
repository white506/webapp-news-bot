import React from 'react';
import { Menu } from '@widgets/Menu';
import { NewsBlock } from '@widgets/NewsBlock';
import styles from './MainPage.module.scss';

const MainPage: React.FC = () => {
  return (
    <div className={styles['main-page']}>
      <h1 className={styles['main-page__title']}>Telegram WebApp</h1>
      
      <section className={styles['main-page__section']}>
        <Menu />
      </section>
      
      <section className={styles['main-page__section']}>
        <NewsBlock />
      </section>
    </div>
  );
};

export default MainPage; 