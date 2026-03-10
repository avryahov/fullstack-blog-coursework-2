# Fullstack Blog Coursework 2

Курсовой проект по миграции учебного frontend-приложения блога в full-stack архитектуру на React, Node.js, Express.js и MongoDB.

## Текущее состояние

На текущем этапе в репозитории зафиксированы:
- целевая структура проекта;
- архитектурные решения для frontend, backend и devops-слоя;
- план миграции из reference-проекта;
- backend API baseline с auth, posts, comments, roles и users admin endpoints.

Реализация прикладного кода выполняется поэтапно после фиксации архитектуры и контрактов.

## Структура репозитория

- `Frontend/` — клиентское React-приложение
- `Backend/` — HTTP API на Node.js + Express.js
- `DevOps/` — docker-compose, reverse proxy и дальнейшие deployment-артефакты
- `docs/` — архитектурные и миграционные документы

## Документы

- `docs/architecture.md` — целевая архитектура и API-контракты
- `docs/migration-plan.md` — порядок реализации, риски и зависимости

## Ближайшие этапы

1. Дореализовать update/delete для постов.
2. Выделить отдельный frontend api/dto/endpoints слой.
3. Подготовить backend BFF adapter layer отдельным этапом.
4. После этого перейти к docker-compose и DevOps-контуру.

## Backend seed

Для локальной backend-проверки seed создает роли и demo-пользователей:
- `admin` / `Admin#123`
- `moder` / `Moder#123`
- `reader` / `Reader#123`

## Frontend Stage 1

Ветка `feature/frontend-migration-stage-1` приносит первый перенос клиента в каталог `Frontend/`.
На этом этапе подключены:
- регистрация;
- логин;
- восстановление сессии через JWT + `/api/auth/me`;
- роли на клиенте;
- список постов;
- просмотр страницы поста;
- комментарии create/delete;
- страница пользователей для admin.

В этом этапе намеренно не делаются:
- update/delete постов;
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
