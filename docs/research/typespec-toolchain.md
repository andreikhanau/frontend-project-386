# Конвейер генерации из TypeSpec: доступные эмиттеры и их возможности

Исследование для [тикета #13](https://github.com/andreikhanau/frontend-project-386/issues/13)
(метка `wayfinder:research`). Документ собирает факты и ссылки. **Выбора
эмиттеров здесь нет** — это работа тикетов
[#15 «Стиль модели в TypeSpec»](https://github.com/andreikhanau/frontend-project-386/issues/15)
и [#16 «Раскладка сгенерированных артефактов и защита от дрейфа»](https://github.com/andreikhanau/frontend-project-386/issues/16).

Все версии зафиксированы на **2026-09-26** и со временем устареют: перед
принятием решения версии нужно перепроверить.

## Границы

В объём исследования попали только внешние источники и сверка с текущим
состоянием репозитория. Ничего не проектировалось и не реализовывалось: в
репозитории не появилось ни одного `.tsp`-файла, ни строки кода генерации, ни
правок в `src/`, `backend/` и CI.

## Как проверялось

Первичные источники, а не пересказы:

- [typespec.io](https://typespec.io/) — официальная документация и разделы
  Emitters / Servers / Clients / Handbook;
- [github.com/microsoft/typespec](https://github.com/microsoft/typespec) —
  исходники эмиттеров (`packages/http-server-js/src`, `packages/http-client-js`);
- реестр npm через `npm view` — версии, `engines`, `peerDependencies`,
  `dependencies`, `dist-tags`, даты публикации;
- эмпирические прогоны в **временном каталоге вне репозитория**:
  `tsp compile` 1.16.0 на Node 26.10.0 / npm 11.19.1, компиляция результата
  TypeScript 6.0.3, запуск AJV 8.20.0 против сгенерированных схем.

Все примеры вывода ниже — реальный вывод прогонов, а не пересказ документации.

---

## 1. Официальные эмиттеры и библиотеки TypeSpec

Версии из реестра npm на 2026-09-26.

| Пакет | Роль | `latest` | `engines.node` |
|---|---|---|---|
| `@typespec/compiler` | компилятор, `tsp` CLI | `1.16.0` (`next` — `1.17.0-dev.10`) | `>=22.0.0` |
| `@typespec/http` | HTTP-привязка (операции, маршруты, коды) | `1.16.0` | `>=22.0.0` |
| `@typespec/rest` | REST-привязка, слои поведения | `0.86.0` | `>=22.0.0` |
| `@typespec/openapi3` | **эмиттер OpenAPI 3.0 и 3.1** | `1.16.0` | `>=22.0.0` |
| `@typespec/openapi` | общие типы OpenAPI | `1.16.0` | `>=22.0.0` |
| `@typespec/json-schema` | **эмиттер JSON Schema** | `1.16.0` | `>=22.0.0` |
| `@typespec/versioning` | версионирование сервисов | `0.86.0` | `>=22.0.0` |
| `@typespec/xml`, `-events`, `-streams`, `-sse` | XML, события, стримы | `0.86.0` | `>=22.0.0` |
| `@typespec/protobuf` | эмиттер Protobuf (preview) | `0.86.0` | — |
| `@typespec/http-client` | базовая библиотека JS-клиента | `0.17.0` | — |
| `@typespec/http-client-js` | **эмиттер клиента JS/TS (preview)** | `0.16.2` | — |
| `@typespec/http-server-js` | **эмиттер серверного кода JS (alpha)** | `0.58.0-alpha.29` | — |
| `@typespec/http-server-csharp` | эмиттер сервера на C# (alpha) | `0.58.0-alpha.32` | `>=22.0.0` |
| `@typespec/http-client-python` | клиент Python (preview) | `0.38.0` | `>=22.0.0` |
| `@typespec/http-client-java` | клиент Java (preview) | `0.9.0` | `>=20.0.0` |
| `@typespec/http-client-csharp` | клиент C# (alpha) | `1.0.0-alpha.20260924.3` | — |
| `@typespec/ts-http-runtime` | рантайм, в который ходит сгенерированный клиент | `0.3.9` | `>=22.0.0` |
| `@typespec/best-practices` | линтер-правила | `0.46.0-dev.0` | `>=18.0.0` |

Ссылки: [README репозитория TypeSpec](https://github.com/microsoft/typespec/blob/main/README.md)
(раздел Packages), [Client Emitters](https://typespec.io/docs/emitters/clients/introduction/),
[Servers → JavaScript](https://typespec.io/docs/emitters/servers/http-server-js/reference/),
[Reproducibility](https://typespec.io/docs/handbook/reproducibility/).

### Статус зрелости — это не выглядит выдумкой

Официальная документация помечает:

- все клиентские эмиттеры как **preview**: «All client emitters are in preview.
  These emitters are actively being developed and may experience changes or
  updates that could affect their functionality»
  ([Client Emitters → Disclaimer](https://typespec.io/docs/emitters/clients/introduction/));
- серверный JS-эмиттер как **experimental**: «This package is highly
  experimental and may be subject to breaking changes and bugs. Please expect
  that your code may need to be updated as this package evolves»
  ([About Generated Projects](https://typespec.io/docs/emitters/servers/http-server-js/project/),
  тот же текст в `README.md` пакета).

Версия `0.58.0-alpha.29` в семантической версии для TypeSpec — это «поколение
0.x», а не стабильный API.

## 2. Чего не существует

Проверено запросами в реестр npm — все 404:

| Что искали | Результат |
|---|---|
| `@typespec/zod` | нет |
| `@typespec/grpc` | нет |
| `@typespec/aws` | нет |
| `@typespec/avro` | нет |
| `@typespec/webhooks` | нет |
| `@typespec/express` | нет |
| `@typespec/fastify` | нет |

Отсюда три факта, важных для карты:

1. **Эмиттера серверного кода под Express 5 не существует.** Ближайшее —
   `@typespec/http-server-js`, alpha, умеющее отдать `expressMiddleware`.
2. **Пути TypeSpec → Zod нет.** Zod достижим только из OpenAPI (см. §5.4).
3. **Пути TypeSpec → TypeScript-типы напрямую нет.** Типы всегда идут через
   OpenAPI или через серверный эмиттер.

Единственная организация `typespec-community` на GitHub содержит один репозиторий:
[`typespec-community/typespec-go`](https://github.com/typespec-community/typespec-go)
(эмиттер Go). Эмиттеров для JS там нет.

Отдельно: `@typespec/best-practices` — единственная опубликованная версия
`0.46.0-dev.0`, и именно она помечена тегом `latest`. Линтер-правила
формально доступны, но пакет не выходил в стабильном релизе.

---

## 3. OpenAPI 3.0 против 3.1

### Как переключается

```yaml
options:
  "@typespec/openapi3":
    openapi-versions: ["3.0.0"]   # или ["3.1.0"], или обе сразу
```

Опция — массив; через `--option` на CLI массив не передать
(проверено: `invalid-schema: Schema violation: must be array (/openapi-versions)`),
так что переключение требует правки `tspconfig.yaml`. Схема конфигурации:
[Configuration](https://typespec.io/docs/handbook/configuration/configuration/).

### Что реально различается в выводе

Для «простого» REST-контракта (объекты, enum, массивы, RFC 3339 даты) документы
3.0 и 3.1, выданные из одного TypeSpec, отличаются **одной строкой**:

```diff
-openapi: 3.0.0
+openapi: 3.1.0
```

Проверено на пробном контракте из трёх моделей — `diff` дал ровно эти строки.

Разница проявляется на `null` и на исключительных границах. TypeSpec
`note?: string | null`:

```yaml
# 3.0.0
note:
  type: string
  nullable: true

# 3.1.0
note:
  anyOf:
    - type: string
    - type: 'null'
```

`@minValueExclusive(0)` / `@maxValueExclusive(10)`:

```yaml
# 3.0.0
a: { type: integer, format: int32, minimum: 0, exclusiveMinimum: true }
# 3.1.0
a: { type: integer, format: int32, exclusiveMinimum: 0 }
```

### Почему это важно именно для валидации

AJV 8 **не компилирует** булеву форму `exclusiveMinimum` из OpenAPI 3.0 ни в
одном из режимов — ни draft-07, ни 2020-12, ни при `strict: false`:

```
Ajv (draft-07)     | OpenAPI 3.0 | strict=true  -> THROWS: schema is invalid: data/properties/a/exclusiveMinimum must be number
Ajv (draft-07)     | OpenAPI 3.0 | strict=false -> THROWS: ... must be number
Ajv2020 (2020-12)  | OpenAPI 3.0 | strict=true  -> THROWS: ... must be number
Ajv2020 (2020-12)  | OpenAPI 3.0 | strict=false -> THROWS: ... must be number
Ajv2020 (2020-12)  | OpenAPI 3.1 | strict=true  -> compiles OK, a=0 rejected=true
```

Другие проверенные факты про AJV 8.20.0:

- `nullable: true` AJV понимает сам, в обоих режимах. `{type: string,
  nullable: true}` + `null` → валидно; `{type: string}` + `null` → невалидно.
  То есть **3.0-схемы ради `nullable` валидируются корректно**.
- `format: date-time` проверяется даже без `ajv-formats` (встроенные форматы).
- В `strict: true` режиме **неизвестные ключевые слова валят компиляцию**:
  `example` → `strict mode: unknown keyword: "example"`. Сырые OpenAPI-схемы
  требуют либо `strict: false`, либо предварительного вырезания аннотационных
  ключевых слов.

Итог для §3: **выбор 3.0 против 3.1 — это в первую очередь выбор
JSON Schema-диалекта, по которому будет валидироваться бэкенд.** 3.0 тянет
булевы `exclusive*` и требует понимания `nullable`; 3.1 — это подмножество
JSON Schema 2020-12, которое AJV понимает нативно. Решение — не здесь.

---

## 4. Клиентский SDK

Четыре варианта. Ниже — что каждый реально выдаёт на пробном OpenAPI из §3.

### 4.1 `@typespec/http-client-js` 0.16.2 — штатный эмиттер TypeSpec

`peerDependencies`: `@typespec/http ^1.16.0`, `@typespec/rest ^0.86.0`,
`@typespec/compiler ^1.16.0`. Зависит от `@typespec/http-client ^0.17.0`,
`@alloy-js/core ^0.24.1`, `@alloy-js/typescript ^0.24.0`,
`@typespec/emitter-framework ^0.21.0`, `prettier ^3.9.6`.
Опции эмиттера — всего две: `emitter-output-dir`, `package-name`
([docs](https://typespec.io/docs/emitters/clients/http-client-js/reference/emitter/)).

**Что он генерирует: отдельный npm-пакет целиком.** В выходной каталог
эмиттер пишет `package.json` и `tsconfig.json`:

```json
{
  "name": "probe-client",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@typespec/ts-http-runtime": "0.2.1",
    "uri-template": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "~18.19.75",
    "typescript": "^5.5.2"
  }
}
```

Плюс `tsconfig.json` с `module: nodenext`, `target: esnext` и `src/**`
(модели, `api/<resource>/…Operations.ts`, `helpers/error.ts`,
`helpers/interfaces.ts`, `models/internal/serializers.ts`).

**Типизация ошибок — отсутствует.** На операцию с
`CallResponse | ErrorResponse` эмиттер выдаёт:

```ts
export interface CreateOptions extends OperationOptions {}
export async function create(
  client: CallsClientContext,
  body: CallRequest,
  options?: CreateOptions,
): Promise<CallResponse> {
  const response = await client.pathUnchecked(path).post(httpRequestOptions);
  if (+response.status === 200 && response.headers["content-type"]?.includes("application/json")) {
    return jsonCallResponseToApplicationTransform(response.body)!;
  }
  throw createRestError(response);
}
```

- Возвращаемый тип — только успешный. Ошибка — `throw`.
- `RestError` собственный, в `helpers/error.ts`, с полями
  `status: string` и `body: any` — не типизированными.
- Модель `ErrorResponse` в `models/models.ts` **вообще не попала**: там только
  модели, достижимые из успешных ответов. То есть тип payload'а ошибки
  приходится доставать руками.
- Ни `ThrowOnError`-дженерика, ни `RequestResult`, ни возврата `{data, error}`.

**Отмена запросов и таймауты — не выведены в поверхность.** Вся
`OperationOptions`, доступная вызывающему коду:

```ts
export interface OperationOptions {
  operationOptions?: {
    onResponse?: (rawResponse: PathUncheckedResponse) => void
  }
}
```

Ни `abortSignal`, ни `timeout`, ни `retryOptions`. Рантайм их умеет
(`PipelineRequestOptions` в `@typespec/ts-http-runtime` содержит `timeout`,
`abortSignal`, `onUploadProgress`, `proxySettings`), но сгенерированный код
собирает `httpRequestOptions` только из `headers` и `body` и наружу это не
пробрасывает. Отмена и таймаут потребовали бы обёртки.

**Скаляры.** `utcDateTime` → нативный `Date`; `Int64` → `bigint`; строковые
литералы → литеральные типы (`status: "ok"`); `int32` → `number`.

**Base URL** переопределяется через `endpoint` в options клиента, дефолт берётся
из `@server` в TypeSpec.

**Замечания по версиям и пиннингу:**

- эмиттер **точно пинит** `@typespec/ts-http-runtime` на `0.2.1`, тогда как
  `latest` в npm — `0.3.9`;
- сгенерированный пакет тянет `typescript ^5.5.2` и `@types/node ~18.19.75` в
  devDependencies — то есть **не рассчитан на TS 6 и на @types/node 26**, которые
  стоят в этом репозитории.

### 4.2 `openapi-typescript` 7.13.0 — только типы

`peerDependencies: { typescript: "^5.x" }`. **Формальный конфликт с TypeScript
6** в репозитории. Пробный прогон на Node 26 отработал без ошибок, потому что
`^5.x` в peer-метаданных не блокирует установку, но npm будет писать
`peer dep` предупреждение.

Вывод: `paths`, `components`, `operations`, `$defs` как TypeScript-типы.
Ни клиента, ни сериализаторов, ни рантайма. Ошибки: `responses` приходят
внутри `operations[...]`, без отдельной «типизации ошибок» — по сути тот же
`default`-ключ, что и у TypeSpec-клиента.

### 4.3 `@hey-api/openapi-ts` 0.99.0 — типизированные ошибки

`engines.node: >=22.18.0`. `peerDependencies`:
`{ typescript: ">=5.5.3 || >=6.0.0 || 6.0.1-rc" }` — **TypeScript 6 заявлен
как поддерживаемый**.

**Типизация ошибок — есть, и она явная.** Из того же пробного OpenAPI:

```ts
export type CallsCreateErrors = {
    // …
    default: ErrorResponse;
};
export type CallsCreateError = CallsCreateErrors[keyof CallsCreateErrors];

export const callsCreate = <ThrowOnError extends boolean = false>(
  options: Options<CallsCreateData, ThrowOnError>,
): RequestResult<CallsCreateResponses, CallsCreateErrors, ThrowOnError> => …
```

Дженерик `ThrowOnError` выбирает между «вернуть ошибку в ответе» и «бросить».
Тип ошибки по статусу — именованный union, ключ `default` соответствует
`default`-ответу OpenAPI.

**Отмена — через `signal`, таймаута нет.** `Config` в
`client/types.gen.ts` объявлен как `extends Omit<RequestInit, 'body'|'headers'|'method'>`,
поэтому `signal` из `RequestInit` доступен. Собственного `timeout` в
сгенерированном коде нет вообще (`grep timeout` по всему выходу — пусто);
таймаут делается через `AbortSignal.timeout()`.

**Проверено на стеке репозитория:** вывод (`@hey-api/typescript` +
`@hey-api/sdk`) компилируется TypeScript 6.0.3 без единой ошибки при
`moduleResolution: bundler`, `verbatimModuleSyntax`, `noUnusedLocals`,
`noUnusedParameters`, `isolatedModules`, `strict`.

Мелочи: `@hey-api/client-fetch` 0.13.1 помечен npm как deprecated
(«Starting with v0.73.0, this package is bundled directly inside
`@hey-api/openapi-ts`») — ставить отдельно не нужно. Есть `@hey-api/client-axios`
0.9.1 (`peer: axios >=1.0.0 <2`) — в этом репозитории axios нет.

### 4.4 `orval` 8.37.0 — клиент + хуки + моки + Zod

`engines.node: >=22.18.0`. Peer-зависимости (typedoc, prettier,
typedoc-plugin-markdown) помечены `optional: true`, то есть конфликта с
TypeScript 6 нет.

Официальный сайт перечисляет поддерживаемые цели: React Query, Vue Query,
Svelte Query, Solid Query, SolidStart, Angular, SWR, Axios, Fetch, MSW, Zod,
Hono, MCP ([orval.dev](https://orval.dev/)). Состав пакетов это подтверждает:
в `dependencies` есть `@orval/query`, `@orval/swr`, `@orval/mock`, `@orval/zod`,
`@orval/axios`, `@orval/fetch`, `@orval/angular`, `@orval/solid-start`,
`@orval/pinia-colada`, `@orval/effect`, `@orval/hono`, `@orval/mcp`.

Плюсы для этого проекта: сразу React Query-хуки вместо голого fetch, MSW-моки
для тестов. Минусы: в репозитории нет ни TanStack Query, ни MSW, ни axios —
это новые зависимости; конфиг Orval — отдельный файл и отдельный рантайм,
не эмиттер TypeSpec.

### Сводка по клиенту

| Вариант | Типизация ошибок | Отмена | Таймаут | TS 6 | Узел | Источник |
|---|---|---|---|---|---|---|
| `@typespec/http-client-js` 0.16.2 | нет (`RestError.body: any`, модель ошибки не генерируется) | не выведена в API | не выведен | да (проверено, кроме `noUnusedLocals`) | — | TypeSpec, preview |
| `openapi-typescript` 7.13.0 | нет отдельной | — | — | **peer `^5.x`** | — | OpenAPI |
| `@hey-api/openapi-ts` 0.99.0 | **да**, `ThrowOnError` + union по статусу | `signal` (из `RequestInit`) | нет (только `AbortSignal.timeout`) | **да, заявлен** | `>=22.18.0` | OpenAPI |
| `orval` 8.37.0 | да | зависит от клиента | зависит от клиента | да (peer optional) | `>=22.18.0` | OpenAPI |

Ни один вариант не даёт таймаут «из коробки», кроме рантайма
`@typespec/ts-http-runtime`, до которого нельзя добраться через API
`@typespec/http-client-js`.

---

## 5. Серверные артефакты и валидация

### 5.1 `@typespec/http-server-js` 0.58.0-alpha.29

`peerDependencies`: `@typespec/http ^1.16.0`, `@typespec/compiler ^1.16.0`,
`@typespec/openapi3 ^1.16.0` (последний — optional,
`peerDependenciesMeta.openapi3.optional: true`).
Зависимости: только `yaml` и `prettier`. **Рантайм-библиотеки для валидации
нет.**

Опции: `emitter-output-dir`, `express` (bool, по умолчанию `false`),
`datetime` (`temporal-polyfill` | `temporal` | `date-duration`),
`omit-unreachable-types`, `no-format`
([docs](https://typespec.io/docs/emitters/servers/http-server-js/reference/emitter/)).

#### Express

При `express: true` эмиттер добавляет в роутер
(`[docs](https://typespec.io/docs/emitters/servers/http-server-js/project/))`:

```ts
expressMiddleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => void,
): void;
```

Роутер монтируется как `app.use(router.expressMiddleware)`; при несовпадении
маршрута вызывается `next()`, поэтому мидлварь надо ставить в начало стека.

#### Валидации схемы нет

Это главный факт. Тело запроса разбирается и **приводится типовым
утверждением**, без проверки ограничений:

```ts
const __body_10 = (await new Promise(function parseBody(resolve, reject) {
  // … собирает Buffer, делает JSON.parse(body)
})) as CallRequest;
```

Пробный контракт использовал `@minLength(1) name: string` и
`@minValue(0) durationMinutes: int32`. Ни то, ни другое не проверяется —
эмиттер не содержит ни одного упоминания `minLength`, `pattern`, `format` или
`constraint` (проверено `grep` по `dist` пакета). Официальная формулировка
про это — «may perform request validation»
([About Generated Projects](https://typespec.io/docs/emitters/servers/http-server-js/project/)),
то есть «может», а не «валидирует».

Что реально приводит к 400 — хук `onInvalidRequest`:

- несовпадение `content-type`;
- невалидный JSON в теле;
- отсутствующий обязательный заголовок;
- отсутствующий обязательный query-параметр.

Дефолтный обработчик отдаёт `400` с `{"error": <строка>}`.

#### Что он всё-таки генерирует

- `http/router.ts` — `createXRouter(serviceImpls, options)` + `dispatch` +
  опциональный `expressMiddleware`;
- `http/operations/server-raw.ts` — по функции на операцию;
- `models/all/<service>.ts` — TS-**интерфейсы** моделей плюс `const X = { toJsonObject, fromJsonObject }` для сериализации;
- `models/synthetic.ts` — интерфейсы опций операций;
- `helpers/*.ts` — `HttpContext`, `HttpResponderError`, `NotFoundError`,
  `BadRequestError`, `ConflictError`, `InternalServerError` и прочие;
- `package.json` и `tsconfig.json` **не генерируются** — в отличие от
  клиентского эмиттера.

Обратите внимание на асимметрию: клиентский эмиттер пишет целый npm-пакет,
серверный — только `.ts`-файлы.

#### Ответ-модель `@error` без кода статуса уходит с 200

На операции `create(@body body: CallRequest): CallResponse | ErrorResponse`
сгенерированный код:

```ts
if ("id" in __result_7) {
  // … 200 + тело CallResponse
} else if ("code" in __result_7) {
  // … response.end(...) — statusCode НЕ выставляется
}
```

Ветка ошибки не задаёт `statusCode`, поэтому уходит **200 с телом ошибки**.
В OpenAPI это выглядит как `default: { description: An unexpected error
response, content: … $ref: ErrorResponse }` — без номера статуса. Типизация
ошибки на клиенте от этого тоже страдает (§4.1).

#### Версионированные сервисы — предупреждение, а не ошибка

При `@versioned(Versions)` компиляция **проходит**, но эмиттер печатает:

```
warning @typespec/http-server-js/openapi3-document-not-generated:
An OpenAPI3 document could not be generated for this service because
versioned services are not yet supported by the HTTP server emitter for JavaScript.
```

Причина видна в исходниках: `src/util/openapi3.ts` вызывает
`getOpenAPI3(...)` и возвращает `undefined` для версионированного сервиса
(`if (serviceRecord.versioned) return undefined`). Эмиттер устроен поверх
JS-API эмиттера OpenAPI 3, поэтому без OpenAPI-документа он уходит в другую
ветку генерации — в выходе появляется иной набор модулей (без
`http/openapi3.ts`).

Побочный факт оттуда же: эмиттер сам конфигурирует `getOpenAPI3` с
`"omit-unreachable-types": true` и `"safeint-strategy": "int64"`, то есть
**серверный вывод по определению сужается относительно OpenAPI-документа**.

### 5.2 Ручные TypeScript-типы из OpenAPI

`openapi-typescript` 7.13.0 на том же OpenAPI отдаёт `paths`,
`components["schemas"]`, `operations` — полный набор типов без клиента и без
рантайма. Плюс: полный контроль над оформлением, никаких alpha-зависимостей.
Минусы: `peer typescript ^5.x` против TypeScript 6 в репозитории; типы ошибок
не выделяются; дублирование того, что уже умеет серверный эмиттер.

### 5.3 AJV по схеме OpenAPI

Самый прямой путь к настоящей валидации: `components.schemas` из OpenAPI 3.1
является подмножеством JSON Schema 2020-12, которое AJV 8 понимает нативно.
Проверенные результаты — в §3, включая то, что булевы `exclusiveMinimum` из
3.0 ломают компиляцию, а `example` ломает `strict: true`.

Требует решения (не здесь): брать схемы из `tsp-output`, генерировать их
`@typespec/json-schema` отдельным шагом или грузить OpenAPI в рантайме.
Отдельно: `ajv` 8.20.0, `ajv-formats` 3.0.1.

### 5.4 Zod

Пути TypeSpec → Zod нет: `@typespec/zod` не существует. Zod-схемы можно
получить **из OpenAPI** через `@orval/zod` (в составе `orval` 8.37.0).
Обратный путь (Zod → OpenAPI) существует отдельными пакетами
(`zod-openapi` 6.0.2, `@anatine/zod-openapi` 2.2.8) — но это противоположное
направление, оно сделало бы Zod источником истины, а не TypeSpec.

Сам `zod` — 4.6.5.

### 5.5 `@typespec/json-schema` 1.16.0

Официальный путь TypeSpec → JSON Schema. Ключевые детали
([guide](https://typespec.io/docs/emitters/json-schema/guide/)):

- схемы создаются **только для типов с декоратором `@jsonSchema`** или
  объявленных в namespace с ним; остальные типы попадают в `$defs`
  ссылающихся схем;
- `emitAllModels: true` — схема на каждый тип программы;
- `emitAllRefs: true` — отдельный файл на каждый тип, на который ссылаются
  JSON Schema-типы;
- `bundleId` — всё в один файл; относительные `$ref` при этом сохраняются,
  и корректность требует поддержки бандлинга из JSON Schema 2020-12;
- опции: `emitter-output-dir`, `file-type` (`json` | `yaml`).

Эмпирически: на пробном контракте **без `@jsonSchema` эмиттер не создал ни
одного файла** — тишина, не ошибка. Это легко пропустить.

### Сводка по серверу

| Подход | Даёт валидацию | Статус | Примечание |
|---|---|---|---|
| `@typespec/http-server-js` | **нет** (только content-type / JSON / обязательные параметры) | `0.58.0-alpha.29`, experimental | Express-мидлварь есть, типизация TS есть |
| Ручные типы из OpenAPI | нет | стабильно | `openapi-typescript` 7.13.0, peer TS `^5.x` |
| AJV по схеме OpenAPI 3.1 | **да** | стабильно | требует 3.1-вывода |
| Zod из OpenAPI | **да** | стабильно | только через `orval`, не из TypeSpec напрямую |
| `@typespec/json-schema` + AJV | **да** | стабильно | нужен `@jsonSchema` или `emitAllModels` |

---

## 6. Совместимость с текущим стеком репозитория

Проверялось на копии сгенерированного вывода, без правок в репозитории.
Компилятор — TypeScript 6.0.3, Express 5.2.1, `@types/express` 5.0.6.

### Что уже совместимо

- **Express 5.** `app.use(router.expressMiddleware)` компилируется без ошибок;
  сигнатура `(IncomingMessage, ServerResponse, () => void) => void`
  assignable к `RequestHandler` Express 5.
- **TypeScript 6 + серверные артефакты при послаблениях.** При
  `module: NodeNext`, `strict`, `esModuleInterop`, `skipLibCheck` сгенерированный
  серверный код компилируется **чисто** — включая `app.ts`, который его
  использует.
- **TypeScript 6 + клиентские артефакты.** При правилах `tsconfig.json`
  репозитория (`moduleResolution: bundler`, `verbatimModuleSyntax`,
  `isolatedModules`, `strict`) клиент компилируется с **единственной**
  ошибкой: `client-src/probeClient.ts(29,3): error TS6133: '#context' is
  declared but its value is never read`. Это не ложное срабатывание: в
  `ProbeClient` поле `#context` присваивается и не читается — мёртвый код в
  выводе эмиттера.
- **Vite 8 / `moduleResolution: bundler`.** Импорты с `.js`-расширениями
  (`./*/models.js`) резолвятся в bundler-режиме без правок.

### Что не совместимо

**Серверный вывод не проходит `tsconfig.server.json` репозитория.** Он требует
`verbatimModuleSyntax: true` и `noUnusedLocals` / `noUnusedParameters`. Прогон
с **точными** настройками `tsconfig.server.json` даёт 15 ошибок:

```
server-raw.ts(3,10):  TS1484: 'HttpContext' is a type and must be imported
                               using a type-only import when 'verbatimModuleSyntax' is enabled
   … ещё 5 × TS1484 в server-raw.ts, 4 × TS1484 в router.ts, 1 в models/all/probe.ts
router.ts(7,1):       TS6133: 'parseHeaderValueParameters' is declared but its value is never read
router.ts(66,12):     TS6133: 'route' is declared but its value is never read
router.ts(74,12):     TS6133: 'error' is declared but its value is never read
router.ts(109,35):    TS6133: 'response' is declared but its value is never read
```

То есть эмиттер пишет `import { HttpContext } from "..."` вместо
`import type { HttpContext } from "..."` и оставляет неиспользуемые
импорты и параметры. Ни один из двух tsconfig это не устраняет.

**Node.** `@typespec/compiler` 1.16.0 и почти все библиотеки требуют
`engines.node: >=22.0.0`. В `package.json` репозитория объявлено
`"node": ">=20.19"`, а CI в `ci.yml` ставит `node-version: 22`
(удовлетворяет). Проверенное поведение npm при нарушении `engines`:

- обычный `npm install` / `npm ci` — предупреждение `npm warn EBADENGINE`,
  установка проходит, код выхода 0;
- с `engine-strict` — `npm error code EBADENGINE`, установка падает.

В репозитории нет `.npmrc` и нет `engine-strict`, так что на Node 22 в CI
это предупреждение. Но объявленный диапазон `>=20.19` после добавления
TypeSpec станет неверным, и `AGENTS.md` / `README.md` это утверждают.

**Один npm-пакет.** Клиентский эмиттер пишет вложенные `package.json` и
`tsconfig.json`. При эмиссии внутрь репозитория это либо конфликтует с
«пакет один, в корне» из `AGENTS.md`, либо требует переноса/переименования
(`emitter-output-dir` это позволяет).

**Линтер и typecheck.** `eslint.config.js` игнорирует только
`['dist', 'backend/dist']`; `tsconfig.json` включает `["src", "vite.config.ts"]`,
`tsconfig.server.json` — `["backend/**/*.ts"]`. Значит любой сгенерированный
артефакт, попавший в `src/` или `backend/`, будет проверен и `npm run lint`, и
`npm run typecheck` — со всеми ошибками из §6.

**Prettier.** `http-server-js` форматирует вывод сам (опция `no-format`
отключает), версия `prettier ^3.9.6` в его зависимостях. Это отдельный
форматтер от того, что может использовать репозиторий.

---

## 7. Что попадает в репозиторий

Файлы, которые пришлось бы завести при использовании TypeSpec:

| Артефакт | Назначение | Примечание |
|---|---|---|
| `main.tsp` (или `*.tsp` + `entrypoint`) | источник истины контракта | имя по умолчанию `main.tsp`; можно переопределить через `entrypoint` при `kind: project` |
| `tspconfig.yaml` | `emit`, `options`, `output-dir`, `warn-as-error`, `linter` | можно пометить `kind: project` + `entrypoint`; поддерживает `extends` |
| `package-lock.json` | существующий, общий | TypeSpec рекомендует коммитить lock-файл и `npm ci` в CI |
| каталог вывода | артефакты эмиттеров | по умолчанию `tsp-output/@typespec/<emitter>/`; переносится `output-dir` или `emitter-output-dir` |
| скрипты `npm run` | запуск `tsp compile` | сейчас в `package.json` нет ни одного скрипта генерации |
| `.gitignore` | исключить промежуточный вывод, если он не коммитится | сейчас `dist` в списке, `tsp-output` — нет |

Про CI:

- `ci.yml` менять можно, Node там 22 — подходит;
- `hexlet-check.yml` трогать нельзя, он выполняется на каждом пуше;
- `warn-as-error: true` в `tspconfig.yaml` — официальная рекомендация
  документации для CI: «It is recommended to use this feature in Continuous
  Integration (CI) to ensure all warnings are addressed»
  ([Configuration](https://typespec.io/docs/handbook/configuration/configuration/));
- `setup-node` с `cache: npm` кеширует по lock-файлу, отдельного кеша для
  TypeSpec не требуется.

Про воспроизводимость: [Reproducibility](https://typespec.io/docs/handbook/reproducibility/)
называет три меры — коммит lock-файла, библиотека `@typespec/versioning`,
фиксация коммит-SHA внешней спецификации. Все три применимы.

---

## 8. Подводные камни

1. **Серверный эмиттер alpha и без валидации.** `0.58.0-alpha.29`,
   помечен experimental. Схемы не валидирует. Если нужна валидация — она
   приходит из другого слоя (§5.3 / §5.4 / §5.5).
2. **Булевы `exclusiveMinimum` ломают AJV.** В 3.0-выводе `@minValueExclusive`
   даёт форму, которую AJV 8 не компилирует ни в одном режиме. Либо 3.1,
   либо отказ от `@minValueExclusive`.
3. **`@error` без `@statusCode` уходит с 200.** На сервере — ветка без
   `statusCode`; в OpenAPI — ключ `default`; на клиенте — `body: any`.
4. **Версионирование сервисов для серверного эмиттера — предупреждение, а не
   ошибка.** Сборка зелёная, ветка генерации другая. В CI без
   `warn-as-error` это пройдёт незамеченным.
5. **Сгенерированный серверный код не проходит `tsconfig.server.json`**
   (15 ошибок: `TS1484` × 11, `TS6133` × 4). Сгенерированный клиент — одна
   ошибка `TS6133` на мёртвое поле `#context`.
6. **Node: `>=22.0.0` против объявленного `>=20.19`.** Пока предупреждение;
   станет ошибкой при `engine-strict` или при правке CI на Node 20.
7. **Клиентский эмиттер пишет вложенный `package.json`** с `typescript ^5.5.2`
   и `@types/node ~18.19.75` — не совпадает со стеком репозитория.
8. **Пин рантайма.** `@typespec/http-client-js` пинит
   `@typespec/ts-http-runtime` на `0.2.1` при `latest` `0.3.9` — обновление
   рантайма не пройдёт через эмиттер.
9. **`--watch` не видит косвенно подключённые JS-файлы** — официально
   зафиксированное известное ограничение
   ([Configuration → `--watch`](https://typespec.io/docs/handbook/configuration/configuration/)).
10. **Дрейф между TypeSpec, OpenAPI и сгенерированными артефактами.** Клиент и
    сервер — два независимых эмиттера от одного TypeSpec, у каждого своя
    версия и своя точка отказа. Сведение проверок в CI — задача тикета #16.
11. **`@typespec/best-practices` не выходил из dev.** Единственная версия
    `0.46.0-dev.0` под тегом `latest`.
12. **`@typespec/json-schema` молчит без `@jsonSchema`.** Нет ни файлов, ни
    ошибки. Молчание легко принять за успех.
13. **Версионионированные выводы OpenAPI получают имена с суффиксом**
    (`openapi.v1.yaml`) — ломает наивные ожидания в скриптах.
14. **Скаляры меняют типы на границе.** `utcDateTime` → `Date`, `Int64` →
    `bigint`. Для JSON по проводу это разные представления, и клиентский
    эмиттер полагается на заголовок `content-type` при разборе ответа
    (`response.headers["content-type"]?.includes("application/json")`) —
    ответ без заголовка будет разобран как успешный, но не распарсен.

---

## 9. Ссылки

Официальное:

- [TypeSpec — установка](https://typespec.io/docs/)
- [TypeSpec — README и таблица пакетов](https://github.com/microsoft/typespec/blob/main/README.md)
- [Emitters → Clients](https://typespec.io/docs/emitters/clients/introduction/)
- [Emitters → Clients → JavaScript](https://typespec.io/docs/emitters/clients/http-client-js/reference/)
- [Emitters → Servers → JavaScript: Overview](https://typespec.io/docs/emitters/servers/http-server-js/reference/)
  (зеркало: [`/docs/libraries/http-server-js/reference/`](https://typespec.io/docs/libraries/http-server-js/reference/))
- [Emitters → Servers → JavaScript: Emitter usage](https://typespec.io/docs/emitters/servers/http-server-js/reference/emitter/)
- [Emitters → Servers → JavaScript: About Generated Projects](https://typespec.io/docs/emitters/servers/http-server-js/project/)
- [Emitters → JSON Schema: Guide](https://typespec.io/docs/emitters/json-schema/guide/)
- [Data Validation (use case)](https://typespec.io/data-validation/)
- [Handbook → Configuration](https://typespec.io/docs/handbook/configuration/configuration/)
- [Handbook → Package Manager](https://typespec.io/docs/handbook/package-manager/)
- [Handbook → Reproducibility](https://typespec.io/docs/handbook/reproducibility/)

Исходники:

- [`packages/http-server-js/src/util/openapi3.ts`](https://github.com/microsoft/typespec/blob/main/packages/http-server-js/src/util/openapi3.ts)
  — вызов `getOpenAPI3` и отказ для версионированных сервисов
- [`packages/http-server-js/src/lib.ts`](https://github.com/microsoft/typespec/blob/main/packages/http-server-js/src/lib.ts)
  — схема опций эмиттера
- [`packages/http-server-js/src/http/server/router.ts`](https://github.com/microsoft/typespec/blob/main/packages/http-server-js/src/http/server/router.ts)
  — `expressMiddleware`, `onInvalidRequest`
- [`packages/http-server-js/package.json`](https://github.com/microsoft/typespec/blob/main/packages/http-server-js/package.json)
  — peer-зависимости, отсутствие рантайма валидации
- [`packages/http-client-js/README.md`](https://github.com/microsoft/typespec/blob/main/packages/http-client-js/README.md)
- [`github.com/microsoft/typespec/issues`](https://github.com/microsoft/typespec/issues) — баг-репорты по эмиттерам

Внешние инструменты:

- [orval.dev](https://orval.dev/)
- [Hey API](https://heyapi.dev/)
- [openapi-typescript](https://openapi-ts.dev/)
- [AJV](https://ajv.js.org/) — [Ajv 2020 / JSON Schema 2020-12](https://ajv.js.org/packages/ajv/dist/2020.html),
  [strict mode](https://ajv.js.org/options.html#strict-mode)
