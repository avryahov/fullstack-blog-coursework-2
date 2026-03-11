# Reverse Test Revision 07

Дата: 2026-03-11

Тип: docker-compose + nginx reverse proxy smoke after migration-style Mongo bootstrap

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Цель

Подтвердить, что локальный full-stack контур поднимается одной командой через `docker compose`, а runtime проверяется через единый reverse proxy вход вместо разрозненных локальных сервисов.

## Состав стека

- `mongo`
- `backend`
- `frontend`
- `reverse-proxy`

## Команды запуска

```bash
docker compose config
docker compose up --build -d
docker compose ps
curl -s -I http://127.0.0.1:8080/
curl -s -I http://127.0.0.1:8080/api/health
curl -s -I http://127.0.0.1:8080/users
curl -s -I http://127.0.0.1:8080/post
curl -s http://127.0.0.1:8080/api/posts
cd Frontend
CI=true npm test -- --runInBand --watch=false post-content.test.jsx post-form.test.jsx private-content.test.jsx users.test.jsx
```

## Что подтвердилось

| Проверка | Результат | Комментарий |
|---|---|---|
| `docker compose up --build -d` | `PASS` | стек поднялся локально без ручного редактирования compose runtime |
| `docker compose ps` | `PASS` | `mongo/backend/frontend/reverse-proxy` в состоянии `healthy` |
| `GET /` через proxy | `200` | reverse proxy отдаёт frontend build |
| `GET /api/health` через proxy | `200` | backend доступен через `/api` и отвечает за proxy |
| `GET /users` через proxy | `200` | deep-link route обслуживается через SPA shell |
| `GET /post` через proxy | `200` | deep-link route обслуживается через SPA shell |
| `GET /api/posts` через proxy | `200` | backend отдаёт baseline posts и `commentsCount` |
| frontend regression tests | `PASS` | `4` suites / `6` tests после compose runtime smoke |

## Наблюдения по инфраструктуре

1. Для воспроизводимого compose-runtime пришлось убрать жёсткие `container_name`, чтобы стек не конфликтовал с уже существующими локальными контейнерами.
2. Host-port для MongoDB в compose не публикуется, потому что backend внутри сети работает по `mongo:27017`, а это снимает конфликты с внешней локальной Mongo.
3. Backend startup переведён на migration-style bootstrap вместо destructive reset.

## Вердикт

`PASS`
