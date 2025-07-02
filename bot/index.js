require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Токен бота из переменных окружения
const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Ошибка: BOT_TOKEN не найден в переменных окружения');
  process.exit(1);
}

// URL для WebApp
const webAppUrl = process.env.WEBAPP_URL || 'https://example.com';

// Создание экземпляра бота
const bot = new TelegramBot(token, { polling: true });

// Хранилище новостей (в реальном приложении использовалась бы база данных)
let latestNews = {
  id: '1',
  title: 'Добро пожаловать',
  text: 'Это первая новость в нашем WebApp. Обновите её, отправив команду /news.',
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
    '/news [заголовок] [текст] [URL изображения] - Обновить новость\n' +
    '/current - Показать текущую новость'
  );
});

// Обработка команды /webapp
bot.onText(/\/webapp/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 'Откройте WebApp:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Открыть WebApp', web_app: { url: webAppUrl } }]
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
    const regex = /"([^"]+)"\s+"([^"]+)"\s+(.+)/;
    const matches = newsData.match(regex);
    
    if (!matches || matches.length < 4) {
      throw new Error('Неверный формат данных');
    }
    
    const title = matches[1];
    const text = matches[2];
    const imageUrl = matches[3];
    
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

// Обработка команды /current
bot.onText(/\/current/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, 
    `Текущая новость:\n\n` +
    `Заголовок: ${latestNews.title}\n` +
    `Текст: ${latestNews.text}\n` +
    `Изображение: ${latestNews.imageUrl}\n` +
    `Дата: ${new Date(latestNews.createdAt).toLocaleString()}`
  );
});

// Обработка данных от WebApp
bot.on('web_app_data', (msg) => {
  const chatId = msg.chat.id;
  const data = msg.web_app_data.data;
  
  try {
    const parsedData = JSON.parse(data);
    
    if (parsedData.action === 'request_news') {
      bot.sendMessage(chatId, 'Получен запрос на обновление новостей');
    }
  } catch (error) {
    console.error('Error processing web_app_data:', error);
  }
});

// Обработка всех остальных сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  // Игнорируем команды, которые уже обрабатываются выше
  if (msg.text && !msg.text.startsWith('/')) {
    bot.sendMessage(chatId, 
      'Я понимаю только команды. Попробуйте /start для получения списка команд.'
    );
  }
});

console.log('Бот запущен...');

// Обработка завершения работы
process.on('SIGINT', () => {
  console.log('Бот остановлен');
  process.exit(0);
}); 