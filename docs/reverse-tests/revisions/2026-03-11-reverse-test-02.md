# Reverse Test Revision 02

Дата: 2026-03-11

Тип: follow-up reverse-test / parity re-check after baseline blockers fix

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Область проверки

- повторный runtime smoke-check backend API;
- повторный role-based and negative testing;
- parity re-check после фикса fresh seed demo-state, `commentsCount` и error UX;
- проверка live runtime для MongoDB, backend и frontend;
- отделение UI-скрытия от backend-enforced access control.

## Сводка запуска

### Команды

```bash
docker start fullstack-blog-coursework-2-mongo
cd Backend
/bin/zsh -lc 'MONGO_URI=mongodb://127.0.0.1:27017/fullstack-blog-coursework-2 npm run seed'
npm run dev
cd ../Frontend
npm start
```

### Порты

| Сервис | Порт | Статус |
|---|---:|---|
| Frontend fullstack | 3000 | поднят |
| Backend fullstack | 3001 | поднят |
| MongoDB | 27017 | поднят в Docker |
| Reference mock API | 3005 | baseline из reference, в этом прогоне не запускался |

### Креды

| Роль | Логин | Пароль |
|---|---|---|
| ADMIN | `admin` | `Admin#123` |
| MODERATOR | `moder` | `Moder#123` |
| READER | `reader` | `Reader#123` |

## Таблица parity по ролям

| Роль | Что работает как в reference | Что отличается | Допустимое отличие или регрессия |
|---|---|---|---|
| GUEST | После fresh seed сразу видит заполненный список постов и страницу поста; не может комментировать; не видит admin UI; backend возвращает `401` на защищённые действия | Seed content не копирует reference тексты 1-в-1 | Допустимое отличие |
| READER | Может логиниться, регистрироваться, добавлять комментарии; не может создавать посты, удалять комментарии, получать `/roles` | Demo creds отличаются от reference | Допустимое отличие |
| MODERATOR | Может удалять комментарии; не имеет admin-доступа к users/roles/post CRUD | Demo creds отличаются от reference | Допустимое отличие |
| ADMIN | Может управлять постами, пользователями и ролями; список постов получает `commentsCount`; fresh seed даёт usable demo-state | Numeric role ids из reference заменены на Mongo ObjectId + role key | Допустимое архитектурное отличие |

## Таблица API smoke-check

| Endpoint | Метод | Результат | Замечания |
|---|---|---|---|
| `/api/auth/login` | `POST` | `200` для `admin/moder/reader` | wrong password -> `401 Неверный логин или пароль` |
| `/api/auth/register` | `POST` | `201` для нового reader | duplicate login -> `409 Пользователь с таким логином уже существует` |
| `/api/auth/me` | `GET` | `200` с валидным admin JWT | без токена -> `401 Нужна авторизация` |
| `/api/posts` | `GET` | `200` | после fresh seed `total=3`, `commentsCount=[2,1,0]` |
| `/api/posts/:id` | `GET` | `200` для seed-поста | baseline post содержит 2 seed comments |
| `/api/posts` | `POST` | `201` для admin | reader -> `403 Недостаточно прав` |
| `/api/posts/:id` | `PATCH` | `200` для admin | проверено на временном runtime-посте |
| `/api/posts/:id` | `DELETE` | `204` для admin | повторный `GET` -> `404 Пост не найден` |
| `/api/posts/:id/comments` | `POST` | `201` для reader | guest -> `401 Нужна авторизация` |
| `/api/comments/:id` | `DELETE` | `204` для moder | reader -> `403 Недостаточно прав` |
| `/api/users` | `GET` | `200` для admin | guest -> `401`, reader -> `403` |
| `/api/users/:id/role` | `PATCH` | `200` для admin | invalid roleId -> `400 Некорректный roleId` |
| `/api/users/:id` | `DELETE` | `204` для admin | last admin delete -> `409 Нельзя удалить или разжаловать последнего администратора` |
| `/api/roles` | `GET` | `200` для admin | guest -> `401`, reader -> `403` |

## Таблица UI/UX parity-check

| Сценарий | Reference behavior | Fullstack behavior | Verdict |
|---|---|---|---|
| Fresh start показывает usable demo content | Да | Да, после seed доступны 3 baseline posts и стартовые comments | match |
| Guest list/post flow на baseline данных | Да | Да, API и frontend route serving подтверждены live | match |
| Список постов показывает число комментариев | Да | Да, `/api/posts` отдаёт `commentsCount`, frontend DTO его маппит | match |
| Login/register server errors | Понятные user-facing сообщения | Да, больше нет приставки `Ошибка запроса:` и API отдаёт аккуратные сообщения | improved |
| Forbidden routes | `/users`, `/post`, `/post/:id/edit` для non-admin запрещены | Route serving на frontend подтверждён, ACL подтверждён backend и React guards | match |
| Reader comment flow | Да | Да, создание комментария `201`, удаление reader запрещено | match |
| Moderator/admin delete comment flow | Да | Да, moderator удаляет комментарий `204` | match |
| Admin users/roles flow | Да | Да, admin получает `/users`, `/roles`, меняет роль и удаляет временного пользователя | match |

## Negative testing

| Категория | Сценарий | Результат |
|---|---|---|
| Wrong credentials | `admin` + wrong password | `401 Неверный логин или пароль` |
| Duplicate registration | register existing `reader` | `409 Пользователь с таким логином уже существует` |
| Validation errors | invalid login/password body | `400 Логин должен содержать 3-15 символов: буквы, цифры или underscore` |
| Auth required | guest comment create, guest `/roles` | `401 Нужна авторизация` |
| Forbidden | reader create post, reader `/roles`, reader delete comment | `403 Недостаточно прав` |
| Not found | missing post, unknown route | `404 Пост не найден`, `404 Маршрут не найден` |
| User/role validation | invalid `roleId` on user role update | `400 Некорректный roleId` |
| Last admin protection | delete admin while he is the last admin | `409 Нельзя удалить или разжаловать последнего администратора` |

## Blockers

Blockers по baseline parity из ревизии 01 в этом прогоне не воспроизвелись.

## Неблокирующие отличия

1. Fullstack использует JWT, MongoDB и ObjectId вместо mock API и numeric role ids.
2. Demo credentials и seed texts не совпадают с reference 1-в-1, но покрывают тот же business flow.
3. Полноценный browser automation в этой ревизии не использовался; UI parity подтверждался live backend/frontend run, route serving и чтением React-кода.
4. Weather не проверялся и не считается blocker’ом по блогу.

## Что стало лучше относительно ревизии 01

1. Fresh seed теперь создаёт baseline posts и comments, поэтому guest/list/post demo-state воспроизводится сразу после `npm run seed`.
2. `GET /api/posts` теперь возвращает `commentsCount` без тупого N+1 на каждую карточку.
3. User-facing backend errors приведены к консистентному русскоязычному виду для `401/403/404/409/400`.
4. Frontend login/register больше не добавляет грубую приставку `Ошибка запроса:` к backend message.
5. Reverse/parity-check по API и ключевым role scenarios теперь проходит без baseline blockers из ревизии 01.

## Что всё ещё не удалось закрыть

1. Полный браузерный e2e прогон UI не выполнялся: в среде не было browser automation, поэтому проверка UI опиралась на live runtime серверов и кодовые guards.

## Вердикт

`PASS WITH ISSUES`
