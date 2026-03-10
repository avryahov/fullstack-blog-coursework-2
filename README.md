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

1. Перенести frontend на работу с backend API.
2. Дореализовать update/delete для постов.
3. Подготовить локальную full-stack проверку frontend + backend + MongoDB.
4. После этого собрать docker-compose контур.

## Backend seed

Для локальной backend-проверки seed создает роли и demo-пользователей:
- `admin` / `Admin#123`
- `moder` / `Moder#123`
- `reader` / `Reader#123`
