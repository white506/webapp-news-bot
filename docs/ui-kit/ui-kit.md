# UI Kit - Telegram WebApp

## Компоненты

### Button

Базовый компонент кнопки с различными вариантами отображения.

#### Варианты

- `primary` - Основная кнопка (синяя)
- `secondary` - Дополнительная кнопка (фиолетовая)
- `outline` - Кнопка с обводкой
- `text` - Текстовая кнопка без фона

#### Размеры

- `sm` - Маленькая
- `md` - Средняя (по умолчанию)
- `lg` - Большая

#### Свойства

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'text' | 'primary' | Вариант отображения |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Размер кнопки |
| block | boolean | false | Растягивать на всю ширину |
| icon | ReactNode | - | Иконка |
| iconPosition | 'left' \| 'right' | 'left' | Позиция иконки |
| disabled | boolean | false | Отключена ли кнопка |

#### Пример использования

```tsx
import Button from 'shared/ui/Button';

// Основная кнопка
<Button variant="primary">Нажми меня</Button>

// Кнопка с иконкой
<Button variant="secondary" icon="🔄">Обновить</Button>

// Кнопка на всю ширину
<Button variant="outline" block>Растянутая кнопка</Button>

// Отключенная кнопка
<Button variant="primary" disabled>Недоступно</Button>
```

### NewsCard

Компонент для отображения новостной карточки.

#### Состояния

- Загрузка (скелетон)
- Заполненное содержимое

#### Свойства

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| news | News \| null | - | Объект с данными новости |
| isLoading | boolean | false | Состояние загрузки |
| className | string | '' | Дополнительные CSS классы |

#### Пример использования

```tsx
import { NewsCard } from 'entities/News';

// Карточка в состоянии загрузки
<NewsCard isLoading={true} />

// Карточка с данными
<NewsCard 
  news={{
    id: '1',
    title: 'Заголовок новости',
    text: 'Текст новости...',
    imageUrl: '/path/to/image.jpg',
    createdAt: '2023-10-15T10:30:00Z'
  }} 
/>
```

## Виджеты

### Menu

Навигационное меню с неактивными кнопками.

#### Свойства

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| className | string | '' | Дополнительные CSS классы |

#### Пример использования

```tsx
import { Menu } from 'widgets/Menu';

<Menu />
```

### NewsBlock

Блок для отображения новостей с возможностью обновления.

#### Свойства

| Свойство | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| className | string | '' | Дополнительные CSS классы |

#### Пример использования

```tsx
import { NewsBlock } from 'widgets/NewsBlock';

<NewsBlock />
```

## Стилевые переменные

### Цвета

```scss
$color-primary: #0088cc;      // Основной цвет (синий Telegram)
$color-secondary: #8774e1;    // Дополнительный цвет
$color-accent: #34aadc;       // Акцентный цвет
$color-text-primary: #222222; // Основной цвет текста
$color-text-secondary: #707579; // Вторичный цвет текста
$color-background: #ffffff;   // Фон
$color-background-secondary: #f0f2f5; // Вторичный фон
$color-border: #dadce0;       // Цвет границ
```

### Размеры отступов

```scss
$spacing-xs: 4px;  // Очень маленький
$spacing-sm: 8px;  // Маленький
$spacing-md: 16px; // Средний
$spacing-lg: 24px; // Большой
$spacing-xl: 32px; // Очень большой
```

### Размеры шрифтов

```scss
$font-size-xs: 12px; // Очень маленький
$font-size-sm: 14px; // Маленький
$font-size-md: 16px; // Средний (по умолчанию)
$font-size-lg: 18px; // Большой
$font-size-xl: 24px; // Очень большой
```

### Радиусы скругления

```scss
$border-radius-sm: 4px;  // Маленький
$border-radius-md: 8px;  // Средний
$border-radius-lg: 12px; // Большой
```

## Миксины

### Флексбокс

```scss
// Базовый флекс контейнер
@mixin flex($direction: row, $justify: flex-start, $align: stretch, $wrap: nowrap) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
  flex-wrap: $wrap;
}

// Центрирование по горизонтали и вертикали
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Типографика

```scss
// Обрезка текста с многоточием
@mixin text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// Многострочная обрезка текста
@mixin multi-line-ellipsis($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Медиа-запросы

```scss
// Мобильные устройства
@mixin mobile {
  @media (max-width: 767px) {
    @content;
  }
}

// Планшеты
@mixin tablet {
  @media (min-width: 768px) and (max-width: 1023px) {
    @content;
  }
}

// Десктопы
@mixin desktop {
  @media (min-width: 1024px) {
    @content;
  }
}
```

## Утилитарные классы

### Отступы

```scss
.mt-xs { margin-top: $spacing-xs; }
.mt-sm { margin-top: $spacing-sm; }
.mt-md { margin-top: $spacing-md; }
.mt-lg { margin-top: $spacing-lg; }
.mt-xl { margin-top: $spacing-xl; }

.mb-xs { margin-bottom: $spacing-xs; }
.mb-sm { margin-bottom: $spacing-sm; }
.mb-md { margin-bottom: $spacing-md; }
.mb-lg { margin-bottom: $spacing-lg; }
.mb-xl { margin-bottom: $spacing-xl; }
```

### Текст

```scss
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.text-primary { color: $color-primary; }
.text-secondary { color: $color-secondary; }
.text-accent { color: $color-accent; }
```

## Рекомендации по использованию

1. Используйте компоненты из UI Kit вместо создания новых
2. Придерживайтесь единой цветовой схемы и размеров
3. Для новых компонентов следуйте существующим паттернам именования и структуры
4. Используйте миксины для повторяющихся стилей
5. Добавляйте новые компоненты в документацию 