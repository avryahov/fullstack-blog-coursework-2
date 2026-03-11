# Fullstack Blog Coursework 2

Курсовой проект по миграции учебного frontend-приложения блога в full-stack архитектуру на React, Node.js, Express.js и MongoDB.

## Текущее состояние

На текущем этапе в репозитории зафиксированы:
- целевая структура проекта;
- архитектурные решения для frontend, backend и devops-слоя;
- план миграции из reference-проекта;
- backend API с auth, posts, comments, roles и users admin endpoints.

Реализация прикладного кода выполняется поэтапно после фиксации архитектуры и контрактов.

## Структура репозитория

- `Frontend/` — клиентское React-приложение
- `Backend/` — HTTP API на Node.js + Express.js
- `DevOps/` — docker-compose, reverse proxy и дальнейшие deployment-артефакты
- `docs/` — архитектурные и миграционные документы

## Документы

- `docs/architecture.md` — целевая архитектура и API-контракты
- `docs/migration-plan.md` — порядок реализации, риски и зависимости
- `docs/frontend-parity-runbook.md` — локальный сценарий проверки frontend parity для post edit/delete
- `docs/reverse-tests/README.md` — каталог reverse/parity-тестов и история ревизий
- `docs/reverse-tests/test-cases.md` — базовая матрица reverse-тестов для повторных прогонов
- `docs/reverse-tests/revisions/2026-03-11-reverse-test-01.md` — первая датированная ревизия reverse-тестирования
- `docs/reverse-tests/revisions/2026-03-11-reverse-test-02.md` — повторная ревизия после закрытия baseline parity-gap
- `docs/reverse-tests/revisions/2026-03-11-reverse-test-03.md` — post-merge runtime re-check по deep links и backend ACL
- `docs/reverse-tests/revisions/2026-03-11-reverse-test-04.md` — targeted UI regression fix для post HTML rendering/edit prefill
- `docs/reverse-tests/revisions/2026-03-11-reverse-test-05.md` — automated regression coverage для post HTML rendering/edit prefill
- `docs/reverse-tests/revisions/2026-03-11-reverse-test-06.md` — automated ACL/UI guard coverage для protected frontend screens

## Ближайшие этапы

1. Закрыть полноценный browser e2e smoke поверх уже подтвержденного live runtime parity.
2. Подготовить backend BFF adapter layer отдельным этапом.
3. После этого перейти к docker-compose и DevOps-контуру.

## Backend seed

Для локальной backend-проверки seed создает:
- роли `admin/moder/reader/guest`;
- demo-пользователей:
- `admin` / `Admin#123`
- `moder` / `Moder#123`
- `reader` / `Reader#123`
- baseline posts для guest/list/post сценариев;
- baseline comments для comment/moderation smoke-check.

Если нужен большой Mongo baseline из reference-проекта `author-blog`, используйте:
- `cd Backend && MONGO_URI=mongodb://127.0.0.1:27017/fullstack-blog-coursework-2 npm run seed:reference`
- импорт сохраняет локальный smoke-доступ `admin / Admin#123`, `moder / Moder#123`, `reader / Reader#123`;
- импорт подтягивает `author-blog/db.json` в Mongo и дополнительно сохраняет smoke-аккаунты `moder` / `reader` для текущих локальных проверок;
- после импорта в БД получается расширенный набор: `15` reference users + `2` smoke users, `31` posts и `383` comments.

## Frontend Stage 1

Ветка `feature/frontend-migration-stage-1` приносит первый перенос клиента в каталог `Frontend/`.
На этом этапе подключены:
- регистрация;
- логин;
- восстановление сессии через JWT + `/api/auth/me`;
- роли на клиенте;
- список постов;
- просмотр страницы поста;
- создание поста;
- update/delete post API на backend;
- комментарии create/delete;
- страница пользователей для admin.

В этом этапе намеренно не делаются:
- отдельные DTO/endpoints/FSD-слои;
- BFF-адаптер;
- compose/devops-обвязка.

## Локальный запуск

1. Поднимите MongoDB локально на `mongodb://127.0.0.1:27017/fullstack-blog-coursework-2`.
2. Подготовьте backend env:
   `cp Backend/.env.example Backend/.env`
3. Запустите backend:
   `cd Backend && npm install && npm run seed && npm run dev`
4. Запустите frontend:
   `cd Frontend && npm install && npm start`

Frontend ожидает backend API на `http://localhost:3001/api`, что соответствует `Backend/.env.example`.

## Backend posts smoke-check

Минимальный ручной smoke для backend post lifecycle перед frontend parity-проверкой:
- логин под `admin` / `Admin#123`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `GET /api/posts/:id`
- `DELETE /api/posts/:id`
- повторный `GET /api/posts/:id` должен вернуть `404`
- если перед удалением создан комментарий, после удаления поста связанный комментарий тоже должен исчезнуть вместе с постом

## Reverse Testing

Reverse-тестирование ведётся в каталоге `docs/reverse-tests/`.

- `test-cases.md` фиксирует стабильную матрицу проверок по ролям, API, UI и negative scenarios;
- `revisions/` хранит датированные отчёты по каждому фактическому прогону;
- baseline-ревизия для миграции: `2026-03-11-reverse-test-01.md`;
- follow-up ревизия после фикса seed demo-state, `commentsCount` и error UX: `2026-03-11-reverse-test-02.md`.
- post-merge ревизия по deep-link route serving и backend ACL: `2026-03-11-reverse-test-03.md`.
- targeted UI regression fix по post HTML rendering/edit prefill: `2026-03-11-reverse-test-04.md`.
- automated regression coverage по post HTML rendering/edit prefill: `2026-03-11-reverse-test-05.md`.
- automated ACL/UI guard coverage по protected frontend screens: `2026-03-11-reverse-test-06.md`.
