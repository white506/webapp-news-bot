# Интеграция с Telegram ботом

## Обзор

Telegram WebApp взаимодействует с ботом для получения и обновления новостей. В этом документе описан процесс интеграции и API для взаимодействия между WebApp и ботом.

## Архитектура взаимодействия

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│  Telegram   │ ◄─────► │    Бот      │ ◄─────► │   WebApp    │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
```

1. Пользователь взаимодействует с ботом в Telegram
2. Бот обрабатывает команды и отправляет данные в WebApp
3. WebApp отображает данные и может отправлять обратно информацию боту

## Telegram WebApp SDK

Для взаимодействия с Telegram используется официальный SDK `@twa-dev/sdk`.

### Инициализация

```typescript
import WebApp from '@twa-dev/sdk';

// Проверка и расширение окна WebApp
if (WebApp.isExpanded) {
  WebApp.expand();
}
```

### Получение данных от бота

Данные от бота могут приходить через:

1. **Начальные данные** (initData) - передаются при запуске WebApp
2. **События** - сообщения, отправляемые через `postEvent`

```typescript
// Получение initData
const initData = WebApp.initData;
const initDataParsed = new URLSearchParams(initData);

// Обработка событий
window.addEventListener('message', (event) => {
  const { data } = event;
  
  if (typeof data === 'string') {
    try {
      const parsedData = JSON.parse(data);
      // Обработка данных
    } catch (error) {
      console.error('Error parsing event data:', error);
    }
  }
});
```

### Отправка данных боту

WebApp может отправлять данные обратно боту через метод `sendData`:

```typescript
// Отправка данных боту
WebApp.sendData(JSON.stringify({
  action: 'request_news',
  timestamp: Date.now()
}));
```

## Формат данных

### Новость

```typescript
interface News {
  id: string;        // Уникальный идентификатор
  title: string;     // Заголовок новости
  text: string;      // Текст новости
  imageUrl: string;  // URL изображения
  createdAt: string; // Дата создания в формате ISO
}
```

### События от бота

```typescript
interface BotEvent {
  type: string;  // Тип события (например, 'news_update')
  data: any;     // Данные события
}
```

## Команды бота

Для взаимодействия с WebApp бот поддерживает следующие команды:

### `/start`

Запускает бота и показывает основные команды.

### `/webapp`

Открывает WebApp.

### `/news [заголовок] [текст] [URL изображения]`

Обновляет новость в WebApp.

**Пример:**
```
/news "Важная новость" "Текст важной новости" https://example.com/image.jpg
```

## Реализация на стороне WebApp

### API клиент (telegramApi.ts)

```typescript
import WebApp from '@twa-dev/sdk';
import { News } from '../../entities/News';

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
      text: 'Это демонстрационная новость для Telegram WebApp.',
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
```

## Реализация на стороне бота

Для полной реализации необходимо создать бота с использованием библиотеки, например, `node-telegram-bot-api` для Node.js.

### Пример кода бота (JavaScript/Node.js)

```javascript
const TelegramBot = require('node-telegram-bot-api');
const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Хранилище новостей (в реальном приложении использовалась бы база данных)
let latestNews = {
  id: '1',
  title: 'Добро пожаловать',
  text: 'Это первая новость в нашем WebApp.',
  imageUrl: 'https://placehold.co/600x400?text=Welcome',
  createdAt: new Date().toISOString()
};

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    'Привет! Я бот для управления WebApp с новостями.\n\n' +
    'Команды:\n' +
    '/webapp - Открыть WebApp\n' +
    '/news [заголовок] [текст] [URL изображения] - Обновить новость'
  );
});

// Обработка команды /webapp
bot.onText(/\/webapp/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Откройте WebApp:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть WebApp', web_app: { url: 'https://your-webapp-url.com' } }]
      ]
    }
  });
});

// Обработка команды /news
bot.onText(/\/news (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const newsData = match[1];
  
  try {
    // Парсинг данных новости (простая реализация)
    const parts = newsData.split('" "');
    const title = parts[0].replace('"', '');
    const text = parts[1];
    const imageUrl = parts[2].replace('"', '');
    
    // Обновление новости
    latestNews = {
      id: Date.now().toString(),
      title,
      text,
      imageUrl,
      createdAt: new Date().toISOString()
    };
    
    bot.sendMessage(chatId, 'Новость успешно обновлена!');
  } catch (error) {
    bot.sendMessage(chatId, 
      'Ошибка при обновлении новости. Используйте формат:\n' +
      '/news "Заголовок" "Текст" URL_изображения'
    );
  }
});

// Обработка данных от WebApp
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  
  try {
    const parsedData = JSON.parse(data);
    
    if (parsedData.action === 'request_news') {
      // Отправка последней новости в WebApp
      // В реальном приложении здесь был бы механизм отправки данных в WebApp
      bot.sendMessage(chatId, 'Получен запрос на обновление новостей');
    }
  } catch (error) {
    console.error('Error processing web_app_data:', error);
  }
});

console.log('Bot is running...');
```

## Тестирование интеграции

1. Создайте бота через @BotFather
2. Получите токен и настройте бота
3. Разместите WebApp на хостинге
4. Настройте WebApp URL в @BotFather
5. Протестируйте взаимодействие:
   - Отправка команд боту
   - Открытие WebApp
   - Обновление новостей
   - Отправка данных из WebApp боту

## Безопасность

1. Всегда проверяйте подлинность данных от Telegram
2. Используйте HTTPS для хостинга WebApp
3. Не храните чувствительные данные в WebApp
4. Проверяйте все входящие данные от пользователей 