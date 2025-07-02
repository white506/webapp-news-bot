# Архитектура проекта Telegram WebApp

## Feature-Sliced Design (FSD)

Проект организован по методологии Feature-Sliced Design (FSD), которая обеспечивает четкое разделение кода на слои и сегменты, что повышает масштабируемость и поддерживаемость.

### Слои архитектуры

1. **app** - Корневой слой приложения
   - Инициализация приложения
   - Глобальные провайдеры
   - Стили верхнего уровня
   - Точка входа в приложение

2. **pages** - Страницы приложения
   - Композиция виджетов для формирования полноценных страниц
   - Маршрутизация (в многостраничных приложениях)
   - Пример: `MainPage`

3. **widgets** - Композиционные блоки интерфейса
   - Самодостаточные блоки, которые можно размещать на страницах
   - Композиция фич и сущностей
   - Примеры: `NewsBlock`, `Menu`

4. **features** - Интерактивные элементы
   - Пользовательские сценарии
   - Бизнес-логика, связанная с действиями пользователя
   - Примеры: обновление новостей, фильтрация, сортировка

5. **entities** - Бизнес-сущности
   - Модели данных
   - Логика работы с данными
   - Представление данных (UI)
   - Примеры: `News`

6. **shared** - Переиспользуемые ресурсы
   - **ui** - UI компоненты (кнопки, инпуты)
   - **api** - API клиенты и методы
   - **lib** - Утилиты и хелперы
   - **config** - Конфигурации
   - **assets** - Статические ресурсы

### Принципы организации кода

1. **Слоистость**: Верхние слои могут импортировать нижние, но не наоборот
   - `app` → `pages` → `widgets` → `features` → `entities` → `shared`

2. **Сегментация**: Код разделен на функциональные сегменты
   - Каждый сегмент отвечает за конкретную бизнес-функцию

3. **Изоляция**: Сегменты не зависят друг от друга напрямую
   - Взаимодействие происходит через публичные API

4. **Композиция**: Сложные компоненты собираются из простых
   - Страница состоит из виджетов, виджеты из фич и сущностей

5. **Алиасы импортов**: Для удобства навигации и чистоты кода используются алиасы
   - `@app/*` → `src/app/*`
   - `@pages/*` → `src/pages/*`
   - `@widgets/*` → `src/widgets/*`
   - `@features/*` → `src/features/*`
   - `@entities/*` → `src/entities/*`
   - `@shared/*` → `src/shared/*`

### Примеры использования алиасов

```tsx
// Вместо
import { Button } from '../../../shared/ui/Button';

// Используем
import { Button } from '@shared/ui/Button';
```

## Именование по БЭМ

В проекте используется методология БЭМ для именования CSS-классов:

### Структура именования

- **Блок**: `.block` - Самостоятельная сущность
- **Элемент**: `.block__element` - Часть блока, не имеющая самостоятельного значения
- **Модификатор**: `.block--modifier`, `.block__element--modifier` - Вариация блока или элемента

### Примеры

```scss
// Блок
.button {
  // Стили блока
}

// Элемент
.button__icon {
  // Стили элемента
}

// Модификатор блока
.button--primary {
  // Стили модификатора
}

// Модификатор элемента
.button__icon--large {
  // Стили модификатора элемента
}
```

### Миксы и переиспользование

```scss
// Миксин для переиспользуемых стилей
@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // Другие общие стили
}

// Использование миксина
.button {
  @include button-base;
  // Специфичные стили
}

.icon-button {
  @include button-base;
  // Специфичные стили
}
```

## Организация SCSS

### Структура файлов

```
shared/
└── ui/
    ├── styles/
    │   ├── variables.scss   # Переменные
    │   ├── mixins.scss      # Миксины
    │   ├── functions.scss   # Функции
    │   ├── reset.scss       # Сброс стилей
    │   └── global.scss      # Глобальные стили
    └── components/          # Стили компонентов
```

### Принципы

1. **Модульность**: Каждый компонент имеет свой SCSS-модуль
2. **Переиспользование**: Общие стили выносятся в миксины и плейсхолдеры
3. **Переменные**: Все цвета, размеры и другие константы определены как переменные
4. **Вложенность**: Минимальная вложенность селекторов для лучшей производительности
5. **Современный синтаксис**: Использование `@use` и `@forward` вместо устаревших `@import`

### Пример организации стилей компонента

```scss
// Button.module.scss
@use '@shared/ui/styles/variables' as v;
@use '@shared/ui/styles/mixins' as m;

.button {
  @include m.button-base;
  
  &--primary {
    background-color: v.$color-primary;
    color: white;
  }
  
  &__icon {
    margin-right: v.$spacing-xs;
  }
}
```

### Использование современного синтаксиса Sass

```scss
// Старый синтаксис (устаревший)
@import '../styles/variables.scss';
@import '../styles/mixins.scss';

// Новый синтаксис
@use '../styles/variables' as v;
@use '../styles/mixins' as m;
@use 'sass:color'; // Импорт модуля для работы с цветом

// Использование переменных и миксинов
.element {
  color: v.$color-primary;
  @include m.flex(row, center, center);
}

// Перенаправление стилей
@forward 'reset';

// Современные функции цвета вместо устаревших
.button {
  // Устаревший вариант
  // background-color: darken($color-primary, 10%);
  
  // Современный вариант
  background-color: color.adjust(v.$color-primary, $lightness: -10%);
  
  // Другие функции для работы с цветом
  border-color: color.scale(v.$color-primary, $lightness: 20%);
  color: color.mix(v.$color-primary, white, 80%);
}
```

## Масштабируемость и поддерживаемость

### Разделение логики и представления

- **Контейнеры**: Управляют состоянием и бизнес-логикой
  ```tsx
  // NewsBlockContainer.tsx
  const NewsBlockContainer = () => {
    const [news, setNews] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Логика загрузки данных
    
    return <NewsBlockView news={news} isLoading={isLoading} />;
  };
  ```

- **Представления**: Отвечают только за рендеринг UI
  ```tsx
  // NewsBlockView.tsx
  const NewsBlockView = ({ news, isLoading }) => {
    return (
      <div className={styles.newsBlock}>
        {isLoading ? <Skeleton /> : <NewsCard news={news} />}
      </div>
    );
  };
  ```

### Внедрение новых фич

1. **Определение слоя**: К какому слою относится новая функциональность
2. **Создание компонентов**: Разработка необходимых компонентов
3. **Композиция**: Интеграция с существующим кодом
4. **Изоляция**: Избегание прямых зависимостей между фичами

### Оптимизация загрузки

- **Lazy Loading**: Динамический импорт компонентов
  ```tsx
  const NewsBlock = React.lazy(() => import('@widgets/NewsBlock'));
  ```

- **Code Splitting**: Разделение кода на чанки
  ```tsx
  // Настройка в webpack/vite для разделения кода
  ```

- **Точки входа**: Четкие точки входа для каждого модуля
  ```tsx
  // index.ts в каждой папке модуля
  export { default as Button } from './Button';
  ```

## Примеры компонентов

### Button.module.scss

```scss
@import '@shared/ui/styles/variables.scss';
@import '@shared/ui/styles/mixins.scss';

.button {
  @include button-base;
  
  &--primary {
    background-color: $color-primary;
    color: white;
    
    &:hover {
      background-color: darken($color-primary, 5%);
    }
  }
  
  &--secondary {
    background-color: $color-secondary;
    color: white;
  }
  
  &__icon {
    margin-right: $spacing-xs;
  }
}
```

### NewsBlock.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { NewsCard } from '@entities/News';
import type { News } from '@entities/News';
import telegramApi from '@shared/api/telegramApi';
import styles from './NewsBlock.module.scss';

export const NewsBlock: React.FC = () => {
  const [news, setNews] = useState<News | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const latestNews = await telegramApi.getLatestNews();
        setNews(latestNews);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className={styles.newsBlock}>
      <h2 className={styles.newsBlock__title}>Новости</h2>
      <NewsCard news={news} isLoading={isLoading} />
    </div>
  );
};
```

### telegramApi.ts

```typescript
import WebApp from '@twa-dev/sdk';
import type { News } from '@entities/News';

class TelegramApi {
  private static instance: TelegramApi;

  public static getInstance(): TelegramApi {
    if (!TelegramApi.instance) {
      TelegramApi.instance = new TelegramApi();
    }
    return TelegramApi.instance;
  }

  public async getLatestNews(): Promise<News> {
    // Логика получения новостей
    return {
      id: '1',
      title: 'Заголовок',
      text: 'Текст новости',
      imageUrl: 'https://example.com/image.jpg',
      createdAt: new Date().toISOString(),
    };
  }
}

export default TelegramApi.getInstance();
```

## Заключение

Архитектура Feature-Sliced Design обеспечивает четкую структуру проекта, что упрощает разработку, тестирование и поддержку кода. Использование методологии БЭМ для именования классов и модульной структуры SCSS повышает читаемость и поддерживаемость стилей. Разделение логики и представления, а также оптимизация загрузки способствуют созданию производительного и масштабируемого приложения.