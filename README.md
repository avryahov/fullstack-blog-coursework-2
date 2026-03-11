# Fullstack Blog Coursework 2

Курсовой full-stack проект по миграции учебного блога из frontend-only реализации в схему `React + Node.js + Express.js + MongoDB` с локальным `docker compose` и единым входом через reverse proxy.

## Project Status

На 2026-03-11 в репозитории уже собраны и локально проверены:
- `Frontend/` с API-вызовами через proxy-friendly base URL;
- `Backend/` с auth, posts, comments, users и roles endpoints;
- Swagger/OpenAPI слой для backend c `openapi.json` и Swagger UI через reverse proxy;
- migration-style bootstrap для MongoDB с журналом прогонов и полным import reference `db.json`;
- full-stack compose-контур `mongo + backend + frontend + reverse-proxy`;
- smoke-проверка runtime через `http://localhost:8080`;
- frontend regression coverage для post HTML rendering/edit flow и protected screens.

Следующий отдельный этап после этого состояния: доработка и расширение пользовательской документации, затем чистая локальная приемка перед merge в `dev`.

## Repository Layout

- `Frontend/` — React SPA
- `Backend/` — Express API и MongoDB migrations
- `DevOps/` — reverse proxy и deployment-oriented конфиги
- `docs/` — архитектура, план миграции и reverse/parity runbooks

## Runtime Architecture

```mermaid
flowchart LR
    Browser["Browser"] --> Proxy["Nginx reverse proxy :8080"]
    Proxy --> Frontend["Frontend container :80"]
    Proxy --> Backend["Backend container :3001"]
    Backend --> Mongo["MongoDB :27017"]
```

Ключевые правила текущего runtime:
- пользовательская проверка идет через `reverse-proxy`, а не через разрозненные host-порты сервисов;
- `frontend` ходит в backend через `/api`;
- обычный startup backend не должен делать destructive reset базы;
- reset базы допустим только через явный `npm run seed`.

## Main Documents

- `docs/architecture.md` — целевая архитектура и API-контракты
- `docs/migration-plan.md` — этапы миграции, зависимости и риски
- `docs/frontend-parity-runbook.md` — локальный parity-runbook по frontend сценариям
- `docs/reverse-tests/README.md` — структура reverse/parity-проверок
- `docs/reverse-tests/test-cases.md` — стабильная матрица ручных проверок
- `docs/reverse-tests/revisions/2026-03-11-reverse-test-10.md` — parity-подтверждение полного reference db import и idempotent compose startup

## API Documentation

Backend публикует OpenAPI-документацию в двух видах:
- raw spec: [http://localhost:8080/api/openapi.json](http://localhost:8080/api/openapi.json)
- Swagger UI: [http://localhost:8080/api/docs](http://localhost:8080/api/docs)

Важно:
- основной пользовательский вход для проверки документации идет через reverse proxy на `:8080`;
- backend также отдает те же маршруты напрямую на своем внутреннем runtime, но это не считается основным сценарием локальной приемки;
- спецификация описывает фактические backend endpoints, DTO, auth scheme, коды ответов и role-based ограничения доступа.

## Compose Startup

Основной локальный вход для full-stack проверки:

```bash
cp .env.example .env
docker compose up --build -d
docker compose ps
```

После запуска приложение должно быть доступно через [http://localhost:8080](http://localhost:8080).

Сервисы стека:
- `mongo`
- `backend`
- `frontend`
- `reverse-proxy`

Что делает backend в compose:
- `npm run migrate` — применяет только еще не выполненные Mongo migrations;
- `npm run start:compose` — сначала миграции, затем API runtime;
- fresh startup на пустом volume автоматически импортирует полный `author-blog/db.json`;
- повторный `docker compose up` не переимпортирует reference-данные поверх существующей БД;
- `npm run seed` — отдельная ручная destructive-операция для reset + повторного bootstrap.

## Smoke Check

Минимальный smoke после подъема compose:

```bash
curl -s -I http://127.0.0.1:8080/
curl -s -I http://127.0.0.1:8080/api/health
curl -s http://127.0.0.1:8080/api/openapi.json | head -c 120
curl -s -I http://127.0.0.1:8080/api/docs
curl -s -I http://127.0.0.1:8080/users
curl -s -I http://127.0.0.1:8080/post
curl -s http://127.0.0.1:8080/api/posts
```

Ожидаемый результат:
- `GET /` возвращает frontend shell;
- `GET /api/health` возвращает `200`;
- `GET /api/openapi.json` возвращает OpenAPI JSON через proxy;
- `GET /api/docs` возвращает Swagger UI через proxy;
- deep links `/users` и `/post` отдаются через SPA shell;
- `GET /api/posts` возвращает reference posts из MongoDB через proxy.

## Local Non-Compose Run

Если нужен раздельный локальный запуск без compose:

```bash
cp Backend/.env.example Backend/.env
cd Backend && npm install && npm run seed && npm run dev
cd Frontend && npm install && npm start
```

В этом режиме frontend ожидает backend API на `http://localhost:3001/api`.

## Reference Data and Seed

Базовый bootstrap и ручной `npm run seed` создают один и тот же reference-state:
- роли `admin`, `moder`, `reader`, `guest`;
- полный набор пользователей, постов и комментариев из `author-blog/db.json`;
- bcrypt-хэши вместо plaintext-паролей;
- migration journal в `schema_migrations`.

Compose runtime:
- на пустом host/volume этот import выполняется автоматически при `docker compose up --build -d`;
- на повторном startup уже примененные миграции пропускаются;
- пользовательские или тестовые изменения в существующей БД обычным startup не стираются.

Если нужен ручной destructive reset в тот же reference-state:

```bash
cd Backend
MONGO_URI=mongodb://127.0.0.1:27017/fullstack-blog-coursework-2 npm run seed
```

Примеры reference-учетных данных:
- `admin / admin123`
- `moder1 / moder123`
- `moder2 / moder456`

Состояние данных после fresh bootstrap:
- `roles`: `4`
- `users`: `15`
- `posts`: `31`
- `comments`: `383`
- duplicate reference comment id `157` сохранен как две отдельные записи, как и в исходном `db.json`

## Regression and Reverse Testing

Reverse-проверки ведутся в `docs/reverse-tests/`.

На текущем этапе уже зафиксированы:
- baseline parity against `author-blog`;
- post-merge re-check по deep links и backend ACL;
- regression coverage для post HTML rendering/edit flow;
- regression coverage для protected frontend screens;
- compose + nginx proxy smoke после migration-style Mongo bootstrap;
- полный reverse regression run по test-cases после `docker compose down -> up --build`.

Текущий быстрый regression-запуск:

```bash
cd Frontend
CI=true npm test -- --runInBand --watch=false post-content.test.jsx post-form.test.jsx private-content.test.jsx users.test.jsx
```
