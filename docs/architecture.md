# Architecture

## Целевая модель репозитория

```text
fullstack-blog-coursework-2/
├── Frontend/
├── Backend/
├── DevOps/
├── docs/
└── README.md
```

## Frontend

Frontend остается отдельным React-приложением, но больше не содержит BFF-логику и не является источником истины для access control.

### Ответственность Frontend

- маршрутизация и страницы;
- UI-компоненты и формы;
- клиентская валидация для UX;
- хранение auth state и текущего пользователя;
- работа с backend API через единый API client;
- отображение ошибок и loading states;
- условный рендеринг по ролям как UX-слой.

### Что не должно оставаться на Frontend

- CRUD-операции напрямую к mock storage;
- проверка прав доступа как единственная защита;
- хранение пароля в `sessionStorage`;
- псевдо-сессии в памяти приложения;
- логика агрегации данных уровня backend.

### Текущее состояние frontend API-слоя

- `client.js` отвечает только за transport и auth headers;
- `endpoints.js` хранит пути и path builders;
- `dto.js` маппит backend response в UI-friendly shape;
- `domains/` группирует API по bounded context: `auth`, `posts`, `comments`, `users`, `roles`;
- `server.js` остается временным compatibility-facade поверх доменных модулей;
- `operations.js` отделяет public/private вызовы для `useServerRequest`;
- pages/components постепенно переводятся на прямые доменные модули там, где контекст очевиден.

### Планируемая структура Frontend

```text
Frontend/
└── src/
    ├── api/
    │   ├── auth-storage.js
    │   ├── client.js
    │   ├── dto.js
    │   ├── domains/
    │   │   ├── auth.js
    │   │   ├── comments.js
    │   │   ├── posts.js
    │   │   ├── roles.js
    │   │   ├── users.js
    │   │   └── index.js
    │   ├── endpoints.js
    │   ├── operations.js
    │   ├── server.js
    │   └── index.js
    ├── app/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── store/
    ├── utils/
    └── constants/
```

## Backend

Backend реализует прикладную бизнес-логику, авторизацию, доступы по ролям, валидацию и работу с MongoDB.

### Слои Backend

```text
Backend/
└── src/
    ├── app/
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── openapi/
    ├── routes/
    ├── services/
    ├── validation/
    ├── utils/
    └── seeds/
```

### Ответственность Backend

- регистрация и логин;
- выпуск токена доступа;
- проверка роли пользователя;
- CRUD постов;
- CRUD комментариев;
- получение списка пользователей;
- изменение роли пользователя;
- удаление пользователя;
- поиск и пагинация постов;
- обработка ошибок;
- нормализация и валидация входных данных.
- публикация OpenAPI spec и Swagger UI для фактического runtime API.

### OpenAPI/Swagger

OpenAPI-слой живет в `Backend/src/openapi/` и подключается на уровне `create-app`.

Маршруты документации:
- `GET /api/openapi.json` — machine-readable OpenAPI 3.0 spec;
- `GET /api/docs` — Swagger UI.

Требование локального runtime:
- документация должна быть доступна через единый proxy-вход `http://localhost:8080/api/...`;
- backend-код является source of truth для DTO, ACL и error responses;
- spec должна описывать только реально существующие endpoints и ограничения.

### Auth strategy

Для учебного MVP рекомендуется JWT access token.

Причины:
- проще реализовать и проверить локально;
- не требует полноценного session store на старте;
- хорошо подходит для разделения frontend/backend;
- достаточен для курсовой, если роли и проверки выполняются на backend.

Компромисс:
- refresh-token flow можно не включать в первую итерацию;
- при необходимости позже можно усилить cookie-based схемой.

## MongoDB model

### Collections

#### `roles`

Поля:
- `_id`
- `key` (`admin`, `moder`, `reader`, `guest`)
- `name`

Назначение:
- seed-коллекция ролей;
- источник для админского управления ролями;
- стабильный справочник для прав доступа.

Текущее состояние в коде:
- роли инициализируются migration `001-core-roles`;
- значения совпадают с reference `db.json`: `admin`, `moder`, `reader`, `guest`.

#### `users`

Поля:
- `_id`
- `login`
- `passwordHash`
- `roleId`
- `registeredAt`
- `createdAt`
- `updatedAt`

Индексы:
- unique index по `login`
- index по `roleId`

Примечание:
- пароль из старого `db.json` переносится через migration-style import и преобразуется в bcrypt hash;
- для трассировки reference-origin используется `sourceId`.

Текущее состояние в коде:
- модель заведена и импорт пользователей уже выполняется migration `002-reference-users`;
- fresh startup на пустой БД создает полный reference users-set.

#### `posts`

Поля:
- `_id`
- `title`
- `imageUrl`
- `content`
- `publishedAt`
- `createdAt`
- `updatedAt`

Индексы:
- index по `publishedAt`
- text index по `title`

Текущее состояние в коде:
- модель заведена;
- import reference posts выполняется migration `003-reference-posts-comments`;
- для трассировки исходного `db.json` хранится `sourceId`.

#### `comments`

Поля:
- `_id`
- `postId`
- `authorId`
- `content`
- `publishedAt`
- `createdAt`
- `updatedAt`

Индексы:
- index по `postId`
- index по `authorId`
- compound index по `postId`, `publishedAt`

Текущее состояние в коде:
- модель заведена;
- import reference comments выполняется migration `003-reference-posts-comments`;
- для сохранения duplicate comment ids из source используется `sourceKey`, потому что в `author-blog/db.json` есть две записи с `id=157`.

### Relationship strategy

- `users.roleId` -> reference на `roles`
- `comments.postId` -> reference на `posts`
- `comments.authorId` -> reference на `users`

Выбор reference вместо embedding нужен потому что:
- комментарии удаляются и читаются отдельно;
- у пользователя и поста своя жизненная модель;
- админские сценарии требуют работы с сущностями независимо.

## API contract

Ниже фиксируется минимальный backend API для первой полной миграции.

### Auth

- `POST /api/auth/register`
  создает пользователя с ролью `reader`
- `POST /api/auth/login`
  возвращает токен и пользователя
- `GET /api/auth/me`
  возвращает текущего пользователя по токену

Текущее состояние в коде:
- auth baseline реализуется через JWT access token;
- `register`, `login` и `me` являются первым обязательным набором endpoint'ов.

### Posts

- `GET /api/posts?search=&page=1&limit=9`
  возвращает список постов и метаданные пагинации
- `GET /api/posts/:id`
  возвращает пост и комментарии
- `POST /api/posts`
  создает пост, только `admin`
- `PATCH /api/posts/:id`
  обновляет пост, только `admin`
- `DELETE /api/posts/:id`
  удаляет пост и связанные комментарии, только `admin`

### Comments

- `POST /api/posts/:id/comments`
  создает комментарий для `reader`, `moder`, `admin`
- `DELETE /api/comments/:id`
  удаляет комментарий для `moder`, `admin`

### Users and roles

- `GET /api/users`
  список пользователей, только `admin`
- `PATCH /api/users/:id/role`
  изменение роли, только `admin`
- `DELETE /api/users/:id`
  удаление пользователя, только `admin`
- `GET /api/roles`
  список ролей, только `admin`

### Документирование API

Swagger/OpenAPI должен покрывать:
- `auth`, `posts`, `comments`, `users`, `roles`, `health`;
- request/response DTO;
- JWT bearer auth scheme;
- коды ответов `400`, `401`, `403`, `404`, `409`, `500`, где они реально возникают;
- role-based ограничения доступа для защищенных операций.
  список ролей, только `admin`

Текущее состояние в коде:
- `GET /api/users`, `PATCH /api/users/:id/role`, `DELETE /api/users/:id` и `GET /api/roles` реализованы;
- для локальной разработки fresh bootstrap и `npm run seed` поднимают полный reference-state из `author-blog/db.json`;
- `PATCH /api/posts/:id` и `DELETE /api/posts/:id` реализованы на backend;
- frontend parity для edit/delete post проверяется отдельным следующим этапом.

## Response shape

Для нового API внешний контракт должен быть в `camelCase`.

Примеры:
- `imageUrl`
- `publishedAt`
- `roleId`

Это позволит не тащить в новый frontend старый mapping из `snake_case` JSON Server.

## Mapping старого проекта в новую архитектуру

### Можно переиспользовать почти без изменений

- страницы и маршруты;
- presentational components;
- клиентские формы;
- базовую Redux-структуру как переходный слой;
- константы ролей и UI-ошибок;
- сценарии main/post/users/auth.

### Переносится в Backend

- весь `src/bff`;
- логика authorize/register/logout;
- checks доступа по ролям;
- агрегация комментариев с автором;
- поиск и пагинация;
- операции создания и удаления постов и комментариев;
- админское управление пользователями и ролями.

### Переписывается полностью

- псевдо-сессии;
- хранение пароля в клиенте;
- прямые вызовы `json-server`;
- генерация идентификаторов на клиенте;
- фронтовой BFF-хук как транспортный слой.

## DevOps contour

На базовом этапе `DevOps/` должен предусматривать место для:
- `docker-compose.yml`
- env templates
- nginx reverse proxy config
- scripts локального запуска

На следующем этапе:
- Terraform для VPS
- Ansible для конфигурации хоста
- deployment scripts и инструкции

## Engineering constraints

- migration-first, а не rewrite-from-scratch;
- backend является источником истины для auth и access;
- контракты фиксируются до массового переноса UI;
- seed-данные должны быть воспроизводимы;
- локальная full-stack приемка обязательна до deploy-контура.
