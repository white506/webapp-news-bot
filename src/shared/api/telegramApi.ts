import WebApp from '@twa-dev/sdk';
import type { News } from '@entities/News';

interface TelegramEventData {
  type: string;
  data: any;
}

class TelegramApi {
  private static instance: TelegramApi;
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor() {
    // Инициализация WebApp
    if (WebApp.isExpanded) {
      WebApp.expand();
    }

    // Настройка обработчика событий от Telegram
    window.addEventListener('message', this.handleEvent.bind(this));
  }

  public static getInstance(): TelegramApi {
    if (!TelegramApi.instance) {
      TelegramApi.instance = new TelegramApi();
    }
    return TelegramApi.instance;
  }

  // Обработчик событий от Telegram
  private handleEvent(event: MessageEvent) {
    try {
      const { data } = event;
      
      if (typeof data === 'string') {
        const parsedData: TelegramEventData = JSON.parse(data);
        
        if (parsedData.type && this.eventListeners.has(parsedData.type)) {
          const listeners = this.eventListeners.get(parsedData.type) || [];
          listeners.forEach(listener => listener(parsedData.data));
        }
      }
    } catch (error) {
      console.error('Error handling Telegram event:', error);
    }
  }

  // Подписка на события
  public on(eventType: string, callback: Function): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.push(callback);
    
    return () => {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // Получение последней новости
  public async getLatestNews(): Promise<News> {
    // В реальном приложении здесь был бы запрос к серверу
    // Для демонстрации используем заглушку
    return {
      id: '1',
      title: 'Последние новости',
      text: 'Это демонстрационная новость для Telegram WebApp. В реальном приложении здесь будет отображаться контент, полученный от бота.',
      imageUrl: 'https://placehold.co/600x400?text=Telegram+WebApp+News',
      createdAt: new Date().toISOString(),
    };
  }

  // Отправка данных в Telegram
  public sendData(data: any): void {
    WebApp.sendData(JSON.stringify(data));
  }

  // Закрытие WebApp
  public close(): void {
    WebApp.close();
  }
}

export default TelegramApi.getInstance();