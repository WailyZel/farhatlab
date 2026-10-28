# FarhatLab — интернет-магазин компьютерной техники

**Технологии для работы, игр и создания.**

FarhatLab — демонстрационный интернет-магазин на React: каталог из **320 товаров** (16 категорий × 20), поиск с выпадающими подсказками, фильтры и сортировка, корзина, избранное, отзывы, тёмная и светлая темы, адаптивный интерфейс. Backend не нужен: данные лежат в JS-файлах, а корзина, избранное, отзывы и тема сохраняются в `localStorage`.

> Все товары, цены (в сомах, KGS) и отзывы вымышлены и нужны только для демонстрации.

## Возможности

- Главная: hero, категории, популярные товары, новинки, скидки, высокий рейтинг, отзывы, преимущества, CTA
- Каталог и категории: 8 фильтров одновременно (категория, бренд, цена от/до, рейтинг, наличие, скидка, новинки), 6 видов сортировки, «Показать ещё»
- Карточка товара: бейджи «Новинка» / «Хит» / скидка, избранное, быстрые характеристики при наведении
- Страница товара: галерея, zoom при наведении и увеличение по клику, количество, «В корзину», «Купить сейчас», характеристики, доставка, гарантия, похожие товары
- Отзывы: средний рейтинг, распределение 5–1, список, модальное окно «Оставить отзыв» (сохраняется в `localStorage`)
- Корзина: добавление, удаление, количество, очистка, скидка, итог, демо-оформление
- Глобальный поиск по названию, бренду, категории, описанию и характеристикам; клавиатурная навигация
- Тема Light / Dark, уведомления (toast), SEO-теги, семантическая вёрстка

## Технологии

React 19, React Router 7, Vite, Context API, `localStorage`, Lucide React, шрифт Inter (подключён локально, без внешних CDN). Без TypeScript.

Изображения товаров генерируются как SVG-иллюстрации прямо в браузере (`src/data/productImage.js`): они не зависят от внешних сервисов и не исчезнут после публикации. У каждого товара три разных изображения.

## Структура проекта

```
src/
├── components/     Header, Footer, ProductCard, ProductGrid, CategoryCard, SearchBar,
│                   FilterPanel, SortSelect, CartItem, ReviewList, ReviewForm, Rating,
│                   Modal, Toast, Layout, ProductImage
├── pages/          Home, Catalog, Product, Cart, Favorites, Search, About, Contacts, NotFound
├── data/           products.js, reviews.js, categories.js, catalog/ (исходные данные), productImage.js
├── context/        Cart, Favorites, Theme, Toast, Reviews
├── hooks/          useSEO, useDebounce, useClickOutside
├── utils/          format, catalog (фильтры и сортировка), search, storage
├── styles/         base.css, components.css, pages.css
├── App.jsx         маршруты
└── main.jsx        точка входа
```

Маршруты: `/`, `/catalog`, `/category/:category`, `/product/:id`, `/cart`, `/favorites`, `/search`, `/about`, `/contacts`, `/404`.

## Установка и запуск

```bash
npm install
npm run dev       # разработка: http://localhost:5173
npm run build     # production-сборка в dist/
npm run preview   # предпросмотр сборки: http://localhost:4173
```

## Публикация на GitHub Pages

1. Создайте репозиторий на GitHub и отправьте код в ветку `main`:
   ```bash
   git init
   git add .
   git commit -m "FarhatLab"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. В репозитории откройте **Settings → Pages** и в поле **Source** выберите **GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` при каждом push в `main` устанавливает Node.js, зависимости, запускает `npm run build` и публикует `dist` через GitHub Pages.
4. Сайт откроется по адресу `https://<user>.github.io/<repo>/`.

### Как это работает с React Router

- Базовый путь задаётся переменной `VITE_BASE` (в workflow это `/<имя репозитория>/`), `BrowserRouter` берёт его из `import.meta.env.BASE_URL`.
- GitHub Pages не знает про клиентские маршруты, поэтому после сборки `index.html` копируется в `404.html`: при прямом заходе на `/<repo>/product/5` Pages отдаёт этот файл, и приложение само показывает нужную страницу.
- Для собственного домена или корня сайта сборка без `VITE_BASE` использует путь `/`.

## Дальнейшее развитие

- Подключить backend и базу данных вместо JS-файлов с данными
- Настоящая авторизация, личный кабинет и история заказов
- Онлайн-оплата и расчёт доставки
- Реальные фотографии товаров (CDN или локальные assets)
- Сравнение товаров, подбор совместимых комплектующих, конструктор ПК
- Модерация отзывов, фото в отзывах
- Тесты (Vitest + Testing Library, Playwright)
