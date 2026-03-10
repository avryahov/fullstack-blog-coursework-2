# Fullstack Blog Coursework 2

Курсовой проект по миграции учебного frontend-приложения блога в full-stack архитектуру на React, Node.js, Express.js и MongoDB.

## Текущее состояние

На текущем этапе в репозитории зафиксированы:
- целевая структура проекта;
- архитектурные решения для frontend, backend и devops-слоя;
- план миграции из reference-проекта;
- минимальный backend skeleton для дальнейшей поэтапной реализации.

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

1. Добавить доменные модели MongoDB и seed-структуру.
2. Реализовать auth baseline и middleware доступа.
3. Перенести backend-логику из старого BFF в отдельный backend.
4. Перевести frontend на работу с реальным API.
5. Подготовить локальный full-stack запуск и затем Docker Compose.
