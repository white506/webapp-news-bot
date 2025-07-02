import React, { useEffect, useState } from 'react';
import { NewsCard } from '@entities/News';
import type { News } from '@entities/News';
import telegramApi from '@shared/api/telegramApi';
import styles from './NewsBlock.module.scss';

interface NewsBlockProps {
  className?: string;
}

export const NewsBlock: React.FC<NewsBlockProps> = ({ className = '' }) => {
  const [news, setNews] = useState<News | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const latestNews = await telegramApi.getLatestNews();
      setNews(latestNews);
    } catch (err) {
      setError('Не удалось загрузить новость. Попробуйте позже.');
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Подписываемся на обновления новостей от Telegram
    const unsubscribe = telegramApi.on('news_update', (newsData: News) => {
      setNews(newsData);
    });

    // Добавляем интервал для автоматического обновления новостей каждые 30 секунд
    const intervalId = setInterval(fetchNews, 30000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const handleRefresh = () => {
    fetchNews();
  };

  return (
    <div className={`${styles['news-block']} ${className}`}>
      <div className={styles['news-block__header']}>
        <h2 className={styles['news-block__title']}>Новости</h2>
        <div 
          className={styles['news-block__refresh']} 
          onClick={handleRefresh}
        >
          <span className={styles['news-block__refresh-icon']}>🔄</span>
          Обновить
        </div>
      </div>

      {error && (
        <div className={styles['news-block__error']}>
          {error}
        </div>
      )}

      <NewsCard news={news} isLoading={isLoading} />
    </div>
  );
};

export default NewsBlock; 