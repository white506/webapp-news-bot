#!/bin/bash

# Скрипт для сборки и деплоя Telegram WebApp

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
  echo -e "${RED}[ERROR]${NC} $1"
  exit 1
}

# Проверка зависимостей
log "Проверка зависимостей..."
if ! command -v npm &> /dev/null; then
  error "npm не установлен. Пожалуйста, установите Node.js и npm."
fi

# Установка зависимостей
log "Установка зависимостей..."
npm install || error "Не удалось установить зависимости"

# Сборка проекта
log "Сборка проекта..."
npm run build || error "Не удалось собрать проект"

# Проверка наличия директории сборки
if [ ! -d "dist" ]; then
  error "Директория сборки 'dist' не найдена"
fi

# Проверка настроек деплоя
if [ -z "$DEPLOY_PATH" ]; then
  warn "Переменная DEPLOY_PATH не установлена. Используем значение по умолчанию."
  DEPLOY_PATH="./deploy"
fi

# Создание директории для деплоя, если она не существует
mkdir -p "$DEPLOY_PATH" || error "Не удалось создать директорию для деплоя"

# Копирование файлов сборки
log "Копирование файлов сборки в $DEPLOY_PATH..."
cp -r dist/* "$DEPLOY_PATH/" || error "Не удалось скопировать файлы сборки"

# Успешное завершение
log "Деплой успешно завершен!"
log "Файлы доступны в директории: $DEPLOY_PATH"

# Дополнительные инструкции
echo ""
echo -e "${YELLOW}Дальнейшие действия:${NC}"
echo "1. Загрузите файлы на ваш хостинг"
echo "2. Настройте ваш Telegram бот через @BotFather"
echo "3. Установите URL вашего WebApp в настройках бота"
echo ""

exit 0 