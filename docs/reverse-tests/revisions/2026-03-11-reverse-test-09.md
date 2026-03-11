# Reverse Test Revision 09

Дата: 2026-03-11

Тип: Swagger/OpenAPI proxy smoke after local backend documentation rollout

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Цель

Подтвердить, что после внедрения Swagger/OpenAPI в backend:
- документация доступна через единый proxy-вход `http://127.0.0.1:8080`, а не только через внутренний backend runtime;
- OpenAPI spec соответствует фактическим backend routes и ACL;
- подключение Swagger не ломает существующую proxy/SPA маршрутизацию;
- compose-контур остается воспроизводимым после полного `down -> up --build`.

## Команды запуска

```bash
docker compose down
docker compose up --build -d
docker compose ps

curl -s http://127.0.0.1:8080/api/health
curl -s http://127.0.0.1:8080/api/openapi.json
curl -s -I http://127.0.0.1:8080/api/docs
curl -s http://127.0.0.1:8080/api/docs/
curl -s -I http://127.0.0.1:8080/
curl -s -I http://127.0.0.1:8080/users
curl -s http://127.0.0.1:8080/api/posts
curl -s -X POST http://127.0.0.1:8080/api/auth/login -H 'Content-Type: application/json' -d '{"login":"admin","password":"admin123"}'
```

## Что реально проверено

| Проверка | Результат | Комментарий |
|---|---|---|
| `docker compose down` | `PASS` | стек полностью остановлен |
| `docker compose up --build -d` | `PASS` | стек поднялся повторно без ручного ремонта |
| `docker compose ps` | `PASS` | `mongo/backend/frontend/reverse-proxy` перешли в `healthy` |
| `GET /api/health` через proxy | `PASS` | backend доступен через единый вход |
| `GET /api/openapi.json` через proxy | `PASS` | `200`, OpenAPI `3.0.3`, `12` backend paths |
| `GET /api/docs` | `PASS` | `301` redirect на `/api/docs/` |
| `GET /api/docs/` | `PASS` | Swagger UI открывается через proxy |
| `GET /` и `GET /users` | `PASS` | frontend shell и SPA deep links не сломаны |
| `GET /api/posts` | `PASS` | runtime posts API продолжает отвечать через proxy |
| `GET /api/roles` без токена | `PASS` | `401 Нужна авторизация` |
| `POST /api/auth/login` + `GET /api/auth/me` | `PASS` | auth smoke подтвержден через proxy |
| `GET /api/roles` с admin token | `PASS` | ACL и admin-only roles endpoint работают |

## Наблюдения

1. Для локального smoke использовались `curl` и реальные proxy-маршруты.
2. Доступ к документации проверялся именно через `http://127.0.0.1:8080`, что соответствует требованию единого входа в стек.
3. Прямая проверка backend host-port в этом прогоне не была основной целью и не использовалась как acceptance path.

## Вердикт

`PASS`
