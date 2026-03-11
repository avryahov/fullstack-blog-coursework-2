# Reverse Test Revision 03

Дата: 2026-03-11

Тип: post-merge runtime re-check after merge `feature/frontend-parity-check` -> `dev`

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

Merge under verification: `bae2c81` (`Merge branch 'feature/frontend-parity-check' into dev`)

## Область проверки

- подтверждение post-merge состояния `dev` после `f6c06f4`;
- live runtime re-check для MongoDB, backend и frontend;
- direct deep-link route serving для `/users`, `/post`, `/post/:id/edit`;
- backend ACL как source of truth для защищённых endpoint'ов.

## Сводка запуска

### Команды

```bash
docker start fullstack-blog-coursework-2-mongo
cd Backend
/bin/zsh -lc 'MONGO_URI=mongodb://127.0.0.1:27017/fullstack-blog-coursework-2 npm run seed'
npm run dev
cd ../Frontend
npm start
curl -s http://127.0.0.1:3001/api/posts
curl -s -X POST http://127.0.0.1:3001/api/auth/login -H 'Content-Type: application/json' -d '{"login":"admin","password":"Admin#123"}'
curl -s -o /tmp/users-guest.out -w '%{http_code}' http://127.0.0.1:3001/api/users
curl -s -o /tmp/reader-create.out -w '%{http_code}' -X POST http://127.0.0.1:3001/api/posts -H 'Content-Type: application/json' -d '{"title":"x","imageUrl":"","content":"y"}'
curl -s -o /tmp/admin-users.out -w '%{http_code}' http://127.0.0.1:3001/api/users -H 'Authorization: Bearer <admin-jwt>'
curl -s http://127.0.0.1:3000/users
curl -s http://127.0.0.1:3000/post
curl -s http://127.0.0.1:3000/post/69b12fd5f4202bfcafcea3b2/edit
```

### Порты

| Сервис | Порт | Статус |
|---|---:|---|
| Frontend fullstack | 3000 | поднят |
| Backend fullstack | 3001 | поднят |
| MongoDB | 27017 | поднят в Docker |

## Результаты post-merge re-check

| Проверка | Результат | Комментарий |
|---|---|---|
| `GET /api/posts` | `200` | после fresh seed возвращаются 3 baseline posts, `commentsCount=[2,1,0]` |
| `POST /api/auth/login` admin | `200` | получен валидный JWT для admin |
| `GET /api/users` guest | `401` | backend продолжает жёстко резать protected endpoint без сессии |
| `POST /api/posts` guest | `401` | создание поста без авторизации не проходит |
| `GET /api/users` admin | `200` | backend отдаёт список demo users `admin/moder/reader` |
| `GET /users` frontend deep link | `200` | dev server отдаёт SPA shell, route обслуживается |
| `GET /post` frontend deep link | `200` | dev server отдаёт SPA shell, route обслуживается |
| `GET /post/:id/edit` frontend deep link | `200` | dev server отдаёт SPA shell, admin edit route доступен для клиентского роутинга |

## Что подтвердилось

1. Merge commit `bae2c81` не сломал baseline demo-state: fresh seed по-прежнему создаёт usable посты, комментарии и demo users.
2. Frontend deep links после merge обслуживаются живым runtime, а не только предполагаются по коду роутера.
3. Backend остаётся источником истины для ACL: без авторизации защищённые действия режутся на API уровне, независимо от frontend route serving.
4. Новых blockers или regressions относительно ревизии 02 в этом прогоне не найдено.

## Ограничения проверки

1. В текущей среде проверки backend пришлось запускать вне sandbox, потому что sandbox не давал подключиться к локальному MongoDB; это ограничение среды проверки, не приложения.
2. Полноценный browser automation и DOM-level UI assert по-прежнему не выполнялись; прямые deep links подтверждены по live HTTP route serving и React-коду.
3. Weather отдельно не проверялся и blocker'ом не считается.

## Вердикт

`PASS WITH ISSUES`
