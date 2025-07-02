require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const url = require('url');

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

// Создаем HTTP-сервер для API
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Добавляем CORS-заголовки для доступа с любого домена
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API для получения последней новости
  if (parsedUrl.pathname === '/api/news/latest' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(latestNews));
    return;
  }
  
  // Если запрос не соответствует ни одному API-эндпоинту
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// Запускаем сервер на порту 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API-сервер запущен на порту ${PORT}`);
});

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

// Функция для извлечения текста в кавычках
function extractQuotedText(text) {
  if (!text.includes('"')) return null;
  
  const startIndex = text.indexOf('"');
  let endIndex = -1;
  let depth = 0;
  
  for (let i = startIndex + 1; i < text.length; i++) {
    if (text[i] === '"' && text[i-1] !== '\\') {
      endIndex = i;
      break;
    }
  }
  
  if (endIndex === -1) return null;
  
  return {
    content: text.substring(startIndex + 1, endIndex),
    rest: text.substring(endIndex + 1).trim()
  };
}

// Обработка команды /news
bot.onText(/\/news (.+)/s, (msg, match) => {
  const chatId = msg.chat.id;
  let newsData = match[1];
  
  try {
    console.log('Получена команда /news с данными:', newsData);
    
    // Разбиваем входные данные на части: заголовок, текст и URL
    // Используем простой алгоритм: ищем первые кавычки, затем вторые, остальное - URL
    
    // Находим заголовок
    const firstQuoteIndex = newsData.indexOf('"');
    if (firstQuoteIndex === -1) throw new Error('Заголовок должен быть в кавычках');
    
    // Ищем закрывающую кавычку для заголовка
    let secondQuoteIndex = -1;
    for (let i = firstQuoteIndex + 1; i < newsData.length; i++) {
      if (newsData[i] === '"' && newsData[i-1] !== '\\') {
        secondQuoteIndex = i;
        break;
      }
    }
    if (secondQuoteIndex === -1) throw new Error('Не найдена закрывающая кавычка для заголовка');
    
    const title = newsData.substring(firstQuoteIndex + 1, secondQuoteIndex);
    
    // Ищем текст (следующая пара кавычек)
    const textStartIndex = newsData.indexOf('"', secondQuoteIndex + 1);
    if (textStartIndex === -1) throw new Error('Текст должен быть в кавычках');
    
    // Ищем закрывающую кавычку для текста
    let textEndIndex = -1;
    for (let i = textStartIndex + 1; i < newsData.length; i++) {
      if (newsData[i] === '"' && newsData[i-1] !== '\\') {
        textEndIndex = i;
        break;
      }
    }
    if (textEndIndex === -1) throw new Error('Не найдена закрывающая кавычка для текста');
    
    const text = newsData.substring(textStartIndex + 1, textEndIndex);
    
    // URL - это всё, что осталось после закрывающей кавычки текста
    const imageUrl = newsData.substring(textEndIndex + 1).trim();
    if (!imageUrl) throw new Error('URL изображения не найден');
    
    console.log('Успешно распарсили данные новости:', { title, text: text.substring(0, 30) + '...', imageUrl });
    
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
    console.error('Ошибка при парсинге новости:', error.message);
    bot.sendMessage(chatId, 
      'Ошибка при обновлении новости. Используйте формат:\n' +
      '/news "Заголовок" "Текст" URL_изображения'
    );
  }
});

// Обработка команды /current
bot.onText(/\/current/, (msg) => {
  const chatId = msg.chat.id;
  
  // Формируем сообщение с полным текстом новости
  const message = `Текущая новость:\n\n` +
    `Заголовок: ${latestNews.title}\n` +
    `Текст: ${latestNews.text}\n` +
    `Изображение: ${latestNews.imageUrl}\n` +
    `Дата: ${new Date(latestNews.createdAt).toLocaleString()}`;
  
  // Если текст слишком длинный, отправляем его частями
  if (message.length > 4000) {
    // Telegram ограничивает длину сообщения примерно 4096 символами
    // Отправляем заголовок и начало текста
    bot.sendMessage(chatId, 
      `Текущая новость:\n\n` +
      `Заголовок: ${latestNews.title}\n` +
      `Дата: ${new Date(latestNews.createdAt).toLocaleString()}`
    );
    
    // Отправляем текст новости
    bot.sendMessage(chatId, `Текст новости:\n\n${latestNews.text}`);
    
    // Отправляем только ссылку на изображение
    bot.sendMessage(chatId, `Изображение: ${latestNews.imageUrl}`);
  } else {
    // Если сообщение не слишком длинное, отправляем его целиком
    bot.sendMessage(chatId, message);
  }
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
  server.close();
  process.exit(0);
}); 