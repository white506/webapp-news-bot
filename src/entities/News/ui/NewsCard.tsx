import React from 'react';
import type { News } from '../model/types';
import styles from './NewsCard.module.scss';

interface NewsCardProps {
  news?: News;
  isLoading?: boolean;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  isLoading = false,
  className = '',
}) => {
  const cardClasses = [
    styles['news-card'],
    isLoading && styles['news-card--loading'],
    className,
  ].filter(Boolean).join(' ');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading || !news) {
    return (
      <div className={cardClasses}>
        <div className={styles['news-card__image']} />
        <div className={styles['news-card__content']}>
          <div className={styles['news-card__title']} />
          <div className={styles['news-card__text']} />
          <div className={styles['news-card__date']} />
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <img
        src={news.imageUrl}
        alt={news.title}
        className={styles['news-card__image']}
      />
      <div className={styles['news-card__content']}>
        <h3 className={styles['news-card__title']}>{news.title}</h3>
        <p className={styles['news-card__text']}>{news.text}</p>
        <div className={styles['news-card__date']}>
          {formatDate(news.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default NewsCard; 