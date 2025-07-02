import React, { useEffect } from 'react';
import { MainPage } from '@pages/index';
import './styles/index.scss';

const App: React.FC = () => {
  useEffect(() => {
    // Инициализация Telegram WebApp
    document.title = 'Telegram WebApp';
  }, []);

  return <MainPage />;
};

export default App; 