import React, { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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

  // Определяем, нужно ли показывать кнопку "Читать далее"
  const needsExpansion = news.text.length > 150;
  
  // Подготавливаем текст для отображения
  const displayText = isExpanded || !needsExpansion ? news.text : `${news.text.substring(0, 150)}...`;

  const textClasses = [
    styles['news-card__text'],
    isExpanded && styles['news-card__text--expanded'],
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      <img
        src={news.imageUrl}
        alt={news.title}
        className={styles['news-card__image']}
      />
      <div className={styles['news-card__content']}>
        <h3 className={styles['news-card__title']}>{news.title}</h3>
        <p className={textClasses}>{displayText}</p>
        
        {needsExpansion && (
          <button 
            className={styles['news-card__expand-button']} 
            onClick={toggleExpand}
          >
            {isExpanded ? 'Свернуть' : 'Читать далее'}
          </button>
        )}
        
        <div className={styles['news-card__date']}>
          {formatDate(news.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default NewsCard; 