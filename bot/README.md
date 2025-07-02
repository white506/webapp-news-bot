# Telegram WebApp Bot

Бот для управления новостями в Telegram WebApp.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` со следующими переменными:
```
# Токен Telegram бота, полученный от @BotFather
BOT_TOKEN=your_bot_token_here

# URL вашего WebApp
WEBAPP_URL=https://your-webapp-url.com
```

## Запуск

```bash
# Запуск в режиме разработки
npm run dev

# Запуск в production режиме
npm start
```

## Команды бота

- `/start` - Начало работы с ботом
- `/webapp` - Открыть WebApp
- `/news "Заголовок" "Текст" URL_изображения` - Обновить новость
- `/current` - Показать текущую новость

## Пример использования

```
/news "Важная новость" "Текст важной новости" https://example.com/image.jpg
``` 