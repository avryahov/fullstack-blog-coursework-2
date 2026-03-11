# Reverse Test Revision 10

Дата: 2026-03-11

Тип: Reference db parity and idempotent compose startup verification

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Цель

Подтвердить, что после возврата migration-style import:
- fresh `docker compose up --build -d` на пустом volume автоматически поднимает полный reference-state из `author-blog/db.json`;
- повторный startup того же compose-контура не переимпортирует данные повторно;
- runtime данные в MongoDB совпадают с reference-проектом по `roles`, `users`, `posts`, `comments`;
- duplicate comment id `157` сохранен без потери одной из записей;
- proxy runtime и auth smoke не сломаны.

## Команды запуска

```bash
docker compose down -v
docker compose up --build -d
docker compose ps

docker compose exec -T backend node --input-type=module -e "..."
curl -s http://127.0.0.1:8080/api/posts?limit=100
curl -s -X POST http://127.0.0.1:8080/api/auth/login -H 'Content-Type: application/json' -d '{"login":"admin","password":"admin123"}'

docker compose up --build -d
docker compose exec -T backend node --input-type=module -e "..."
```

## Что реально проверено

| Проверка | Результат | Комментарий |
|---|---|---|
| `docker compose down -v` | `PASS` | volume очищен перед fresh acceptance |
| `docker compose up --build -d` | `PASS` | стек поднят с нуля без ручного `seed` |
| `docker compose ps` | `PASS` | `mongo/backend/frontend/reverse-proxy` перешли в `healthy` |
| Fresh Mongo counts | `PASS` | `roles=4`, `users=15`, `posts=31`, `comments=383` |
| Full parity vs `author-blog/db.json` | `PASS` | `diffs: []` по `roles/users/posts/comments` |
| Duplicate comment id `157` | `PASS` | в Mongo присутствуют обе reference-записи |
| `GET /api/posts?limit=100` через proxy | `PASS` | `total=31`, reference posts отдаются через единый вход |
| `POST /api/auth/login` admin | `PASS` | `admin/admin123` логинится на reference-state |
| Повторный `docker compose up --build -d` | `PASS` | существующая БД не сброшена и не продублирована |
| Migration journal after repeat startup | `PASS` | текущие миграции остаются с `runs=1`, повторный import не выполняется |

## Наблюдения

1. Исторический regression из сегодняшнего git-лога подтвержден: после `e39c9d7` полный reference import существовал, а в `f304a64` runtime сместился к demo-baseline.
2. Текущее состояние снова соответствует требованию full reference bootstrap на пустом host.
3. Для comment parity пришлось учитывать реальное свойство source data: в `db.json` два комментария с одинаковым `id=157`, поэтому идентификация в Mongo ведется по `sourceKey`, а не только по `sourceId`.

## Вердикт

`PASS`
