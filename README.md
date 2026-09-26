# Календарь звонков

Учебный проект Hexlet: упрощённый аналог [Cal.com](https://cal.com) — сервис для планирования звонков по свободным временным слотам.

> **Статус проекта:** этап 1 — каркас приложения. Функциональность бронирования не реализована.

## Стек

- **React 19** + **Vite 8** + **TypeScript 6** — клиент
- **Express 5** + **TypeScript 6** — бэкенд
- **React Router 7** — маршрутизация
- **Redux Toolkit** + **React Redux** — глобальное состояние
- **Vitest** + **Testing Library** (jsdom) + **Supertest** (node) — тесты
- **CSS Modules** + CSS-переменные — стили без UI-библиотек
- **ESLint** + **typescript-eslint** — линтер (конфигурация `eslint.config.js`)
- **GitHub Actions** — CI и release-please

Интерфейс на русском языке, имена файлов, компонентов и переменных — на английском.

## Запуск

```bash
npm install          # установка зависимостей

npm run dev          # клиент + бэкенд одновременно
npm run dev:client   # только клиент (http://localhost:5173)
npm run dev:server   # только бэкенд (http://localhost:3001)

npm run build        # typecheck + сборка бэкенда и клиента
npm run typecheck    # проверка типов без сборки
npm run preview      # предпросмотр production-сборки клиента
npm run start:server # запуск собранного бэкенда (после build)

npm run lint         # проверка кода линтером
npm test             # прогон тестов
```

### Порты и прокси

| Что | Адрес |
|---|---|
| Клиент (Vite) | http://localhost:5173 |
| Бэкенд (Express) | http://localhost:3001 |
| API через прокси Vite | http://localhost:5173/api/... |

Vite проксирует все запросы с `/api` на `http://localhost:3001`
(настройка в `vite.config.ts`).

### API

| Метод | Путь | Ответ |
|---|---|---|
| `GET` | `/api/health` | `{ "status": "ok" }` |

## Структура

```
├── index.html
├── vite.config.ts             # Сборка клиента, прокси /api, настройки Vitest
├── tsconfig.json              # Типы клиента (src + vite.config.ts), noEmit
├── tsconfig.server.json       # Типы и сборка бэкенда → backend/dist
├── eslint.config.js
│
├── src/                       # Клиент
│   ├── main.tsx               # Точка входа: Provider + Router
│   ├── App.tsx                # Описание маршрутов
│   ├── App.test.tsx           # Смоук-тесты каркаса
│   ├── setupTests.ts          # Подготовка окружения тестов
│   ├── vite-env.d.ts          # Типы Vite и jest-dom
│   ├── app/
│   │   └── store.ts           # Конфигурация Redux-хранилища
│   ├── components/
│   │   ├── AppLayout.tsx      # Лейаут: шапка, навигация, футер
│   │   └── AppLayout.module.css
│   ├── pages/
│   │   ├── HomePage.tsx       # Стартовая страница-заглушка
│   │   └── HomePage.module.css
│   └── styles/
│       ├── variables.css      # Дизайн-токены (цвета, отступы, шрифты)
│       └── global.css         # Сброс и базовые стили
│
└── backend/                   # Бэкенд
    ├── index.ts               # Запуск сервера
    ├── app.ts                 # Express-приложение и маршруты
    ├── app.test.ts            # Тесты API (supertest)
    ├── types.ts               # Общие типы API
    └── dist/                  # Сборка (в git не попадает)
```

## Тесты

Vitest + Testing Library, окружение jsdom.

```bash
npm test        # однократный прогон
npm run test:watch  # watch-режим
```

Настройки тестов — в секции `test` файла `vite.config.ts`.
Общие для всех тестов настройки — в `src/setupTests.ts`.

Окружения различаются per-файл: клиентские тесты работают в `jsdom`
(значение по умолчанию), тесты API — в `node`, объявленном директивой
`// @vitest-environment node` в начале файла.

## CI и релиз

### `.github/workflows/ci.yml`

Прогоняется на push в любую ветку, на тегах, при PR и вручную.
Последовательно выполняет `npm ci` → `npm run lint` → `npm test` → `npm run build` (Node 22).

### `.github/workflows/release-please.yml`

[release-please](https://github.com/googleapis/release-please) в manifest-режиме.
Запускается при push в `main`: собирает релизный PR по Conventional Commits,
а после его merge — публикует GitHub Release и обновляет `CHANGELOG.md`.

Конфигурация:
- `release-please-config.json` — параметры пакета (release-type `node`, имя `call-calendar`)
- `.release-please-manifest.json` — текущая версия (`0.1.0`)

Типы коммитов: `feat:` — minor, `fix:` — patch, `feat!:`/`BREAKING CHANGE:` — major.

## Что уже настроено

- Клиент на React + TypeScript: провайдеры `Redux Provider` и `BrowserRouter`
- Лейаут с навигацией на базе массива `NAV_ITEMS`
- Маршрут `/` со стартовой страницей-заглушкой
- Дизайн-токены и базовые стили
- Express-бэкенд с `GET /api/health`
- Прокси `/api` с клиента на бэкенд
- Vitest: смоук-тесты каркаса (jsdom) и тесты API (supertest, node)
- Строгий TypeScript (`strict`, `noUnusedLocals`, `noUnusedParameters`) для клиента и бэкенда
- CI (lint / test / build) и автоматизация релизов
- `lang="ru"`, заголовок и favicon

## Планируемые разделы

Определяются спецификацией и тикетами на следующих этапах:

- Мои звонки (список запланированных и прошедших)
- Страница бронирования по публичной ссылке
- Типы звонков (длительность, интервалы, слоты)
- Настройки профиля и часового пояса
