# AGENTS.md

Учебный проект Hexlet: «Календарь звонков» — упрощённый аналог Cal.com.
Подробности архитектуры — в `README.md`.

## Границы этапа

Сейчас этап 1 — только каркас. Не реализованы и не нужны до отдельной
спецификации: авторизация, БД, календарь, слоты, бронирование, пользователи,
внешние интеграции. Не выходи за эти рамки без запроса.

## Директории

| Путь | Что это |
|---|---|
| `src/` | клиент React: страницы, компоненты, стили |
| `backend/` | Express API |
| `vite.config.ts` | сборка клиента, proxy, настройки Vitest |
| `tsconfig.json` | типы клиента, `noEmit` |
| `tsconfig.server.json` | типы и сборка бэкенда в `backend/dist` |

Пакет один, в корне. Workspaces не используются: `backend/` ставится из
корневого `node_modules`, а `ci.yml` выполняет `npm ci` только в корне.

## Команды

```bash
npm run dev        # concurrently: клиент + бэкенд
npm run typecheck  # tsc по обоим tsconfig
npm run lint       # eslint .
npm test           # vitest run
npm run build      # typecheck + сборка бэкенда и клиента
```

Перед коммитом запускай `npm run build`: `lint` и `test` ошибки типов не ловят.

## Импорты в backend

В `backend/` относительные импорты **с расширением `.js`**, хотя файлы `.ts`:

```ts
import { createApp } from './app.js'   // ✅
import { createApp } from './app'     // ❌ TS2835
```

В `src/` — наоборот, без расширения: `import App from './App'`.

## Порты

Клиент `:5173`, бэкенд `:3001`. Vite проксирует `/api` → `http://localhost:3001`.
Порт задан в двух местах: `backend/index.ts` и `SERVER_PORT` в `vite.config.ts` —
при смене правь оба.

## CI

`.github/workflows/hexlet-check.yml` — **не изменять, не удалять, не
переименовывать**. Требование Хекслета.

## Conventional Commits

Обязательны: release-please разбирает сообщения коммитов, без распознанного
типа релиз не создаётся.

- `feat:` — minor
- `fix:` — patch
- `feat!:` / `BREAKING CHANGE:` — major
- также `test:`, `docs:`, `chore:`, `refactor:`

## Соглашения

- Тексты интерфейса и README — русский; имена файлов, переменных, компонентов —
  английский.
- Стили: CSS Modules + дизайн-токены в `src/styles/variables.css`. UI-библиотек
  нет, не добавляй без запроса.

## README

В `README.md` есть блоки, требуемые Хекслетом: бейдж `hexlet-check`, описание
задания со ссылками, `<details>` про `hexlet-check.yml`, раздел «О Хекслете».
Правь точечно, не переписывай файл целиком.
