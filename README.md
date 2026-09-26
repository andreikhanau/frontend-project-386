# Календарь звонков

[![hexlet-check](https://github.com/andreikhanau/frontend-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/andreikhanau/frontend-project-386/actions)

Разработайте совместно с ИИ сервис для бронирования календаря

Учебный проект Хекслета: https://ru.hexlet.io/programs/frontend
Как это должно работать: https://files.hexlet.app/a/2ipc5m

> **Статус проекта:** каркас готов, реализуется первая фича — главная
> страница со ссылкой на страницу записи. Бронирование, слоты, календарь,
> БД и остальные функции пока не реализованы. Границы объёма зафиксированы
> в [ADR-0001](docs/adr/0001-scope-zadaniya-hekslet.md).

## Стек

- **React 19** + **Vite 8** + **TypeScript 6** — клиент
- **Express 5** + **TypeScript 6** — бэкенд
- **React Router 7** — маршрутизация
- **Redux Toolkit** + **React Redux** — глобальное состояние
- **Vitest** + **Testing Library** (jsdom) + **Supertest** (node) — тесты
- **CSS Modules** + CSS-переменные — стили без UI-библиотек
- **ESLint** + **typescript-eslint** — линтер
- **GitHub Actions** — CI и release-please

Интерфейс на русском языке, имена файлов, компонентов и переменных — на английском.

## Установка

```bash
git clone https://github.com/andreikhanau/frontend-project-386.git
cd frontend-project-386
npm install
```

## Использование

```bash
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

## Структура проекта

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
│   ├── App.test.tsx           # Смоук-тесты каркаса и тесты главной страницы
│   ├── setupTests.ts          # Подготовка окружения тестов
│   ├── vite-env.d.ts          # Типы Vite и jest-dom
│   ├── app/
│   │   └── store.ts           # Конфигурация Redux-хранилища
│   ├── components/
│   │   ├── AppLayout.tsx      # Лейаут: шапка, навигация, футер
│   │   ├── AppLayout.module.css
│   │   ├── ButtonLink.tsx      # Кнопка-ссылка (primary / secondary)
│   │   └── ButtonLink.module.css
│   ├── pages/
│   │   ├── HomePage.tsx       # Главная: описание сервиса и основное действие
│   │   ├── HomePage.module.css
│   │   ├── BookingPage.tsx    # Страница записи (заглушка)
│   │   └── BookingPage.module.css
│   └── styles/
│       ├── variables.css      # Дизайн-токены (цвета, отступы, шрифты)
│       └── global.css         # Сброс и базовые стили
│
├── CONTEXT.md                 # Глоссарий домена
├── docs/
│   ├── adr/                   # Принятые решения
│   │   ├── 0001-scope-zadaniya-hekslet.md
│   │   └── 0002-statichnaya-glavnaya.md
│   └── agents/                # Инструкции агентам
│
└── backend/                   # Бэкенд
    ├── index.ts               # Запуск сервера
    ├── app.ts                 # Express-приложение и маршруты
    ├── app.test.ts            # Тесты API (supertest)
    ├── types.ts               # Общие типы API
    └── dist/                  # Сборка (в git не попадает)
```

## Тесты

```bash
npm test           # однократный прогон
npm run test:watch # watch-режим
```

Настройки — в секции `test` файла `vite.config.ts`,
общие для всех тестов — в `src/setupTests.ts`.

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
- Главная страница `/`: описание сервиса, шаги записи и основное действие
- Страница записи `/booking` — заглушка с переходом на главную
- Переиспользуемая кнопка-ссылка `ButtonLink` (`primary` / `secondary`)
- Дизайн-токены и базовые стили
- Express-бэкенд с `GET /api/health`
- Прокси `/api` с клиента на бэкенд
- Vitest: тесты каркаса и главной страницы (jsdom), тесты API (supertest, node)
- Строгий TypeScript (`strict`, `noUnusedLocals`, `noUnusedParameters`) для клиента и бэкенда
- CI (lint / test / build) и автоматизация релизов
- `lang="ru"`, заголовок и favicon

## Что дальше

Следующие шаги определяются заданием и отдельными спецификациями. Сейчас
не реализованы: выбор звонка и календарь со свободным временем, создание и
хранение записей, валидация данных и обработка ошибок, база данных.

Границы объёма зафиксированы в
[ADR-0001](docs/adr/0001-scope-zadaniya-hekslet.md): разделы, которых нет в
задании, в план не входят.

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.
