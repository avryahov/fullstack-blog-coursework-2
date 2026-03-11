# Reverse Test Revision 01

Дата: 2026-03-11

Тип: baseline reverse-test / parity-check for migration

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Область проверки

- backend API smoke-check;
- role-based and negative testing;
- UI/UX parity against reference behavior;
- отделение UI-скрытия от реального backend access control;
- учёт допустимых архитектурных отличий fullstack реализации.

## Сводка запуска

### Команды

```bash
docker run --name fullstack-blog-coursework-2-mongo -p 27017:27017 -d mongo:7
cd Backend
cp .env.example .env
npm run seed
npm run dev
cd ../Frontend
HOST=127.0.0.1 PORT=3000 npm start
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
| GUEST | Видит list/get post, не видит admin UI, не может комментировать, не может ходить в admin routes | После seed нет baseline posts для демонстрации guest flow на данных | Регрессия parity-demo |
| READER | Может логиниться, регистрироваться, добавлять комментарии, не может удалять комментарии, не может управлять постами и users | Backend errors частично англоязычные | Допустимое UX-отличие |
| MODERATOR | Может удалять комментарии, не имеет admin-доступа | Backend errors частично англоязычные | Допустимое UX-отличие |
| ADMIN | Может управлять постами, пользователями и ролями | Список постов не получает `commentsCount`; после seed нет стартового контента | `commentsCount` и пустой seed — регрессии parity |

## Таблица API smoke-check

| Endpoint | Метод | Результат | Замечания |
|---|---|---|---|
| `/api/auth/login` | `POST` | `200` для `admin/moder/reader` | wrong password -> `401 Invalid login or password` |
| `/api/auth/me` | `GET` | `200` с токеном | без токена -> `401 Authentication required` |
| `/api/posts` | `GET` | `200` | после fresh seed `posts: []` |
| `/api/posts/:id` | `GET` | `200` для существующего поста | после удаления -> `404 Post not found` |
| `/api/posts` | `POST` | `201` для admin | guest -> `401`, reader -> `403` |
| `/api/posts/:id` | `PATCH` | `200` для admin | reader -> `403` |
| `/api/posts/:id` | `DELETE` | `204` для admin | reader -> `403` |
| `/api/posts/:id/comments` | `POST` | `201` для reader | guest -> `401` |
| `/api/comments/:id` | `DELETE` | `204` для moder/admin | reader -> `403` |
| `/api/users` | `GET` | `200` для admin | guest -> `401`, reader -> `403` |
| `/api/users/:id/role` | `PATCH` | `200` для admin | invalid roleId -> `400`, reader -> `403` |
| `/api/users/:id` | `DELETE` | `204` для admin | last admin delete -> `409` |
| `/api/roles` | `GET` | `200` для admin | guest -> `401`, reader -> `403` |

## Таблица UI/UX parity-check

| Сценарий | Reference behavior | Fullstack behavior | Verdict |
|---|---|---|---|
| Guest не видит admin UI | Admin controls hidden | Admin controls hidden in header | match |
| Admin видит edit/delete post flow | Да | Да | match |
| Post form предзаполнена при edit | Да | Да | match |
| После save изменения видны на странице поста | Да | Да | match |
| После save изменения видны в списке | Да | Да | match |
| После delete пост исчезает из списка и больше не открывается | Да | Да | match |
| Reader может добавлять комментарии | Да | Да | match |
| Moderator/admin могут удалять комментарии | Да | Да | match |
| Reader не может удалять комментарии | Да | Да | match |
| Admin может открыть users page, менять роли и удалять пользователей | Да | Да | match |
| Список постов показывает число комментариев | Да | Нет, карточка получает `commentsCount: null` и рендерит `—` | mismatch |
| Fresh start показывает usable demo content | Да | Нет, seed очищает posts/comments и не создаёт baseline posts | mismatch |

## Negative testing

| Категория | Сценарий | Результат |
|---|---|---|
| Forbidden routes | `/users`, `/post`, `/post/:id/edit` для non-admin | UI показывает `Доступ запрещен` |
| Forbidden actions | guest create post/comment, reader CRUD post, reader delete comment, reader users/roles | Backend возвращает `401/403` |
| Wrong credentials | wrong password | `401 Invalid login or password` |
| Duplicate registration | register existing login | `409 Login already exists` |
| Validation errors | invalid login/password body | `400` |
| Not found | missing post, unknown route | `404 Post not found`, `404 Route not found` |
| Cascade delete | comment delete after parent post delete | `404 Comment not found` |
| Admin protection | delete last admin | `409 At least one admin user must remain` |

## Детальные зафиксированные сценарии

| ID | Сценарий | Факт |
|---|---|---|
| RT-ADMIN-03 | Admin create post | pass |
| RT-ADMIN-06 | Admin save edited post | pass |
| RT-ADMIN-07 | Updated post visible in list | pass |
| RT-ADMIN-08 | Admin delete post | pass |
| RT-ADMIN-11 | Admin change user role | pass |
| RT-ADMIN-12 | Admin delete user | pass |
| RT-ADMIN-13 | Delete last admin | pass |
| RT-READER-02 | Reader add comment | pass |
| RT-READER-03 | Reader delete comment forbidden | pass |
| RT-MODER-02 | Moderator delete comment | pass |
| RT-GUEST-04 | Guest comment forbidden | pass |
| RT-PAR-05 | Backend is source of truth for ACL | pass |
| RT-PAR-01 | Guest parity on real content | partial, because no seeded posts |
| RT-PAR-04 | Admin post list parity | partial, because no `commentsCount` |

## Blockers

1. Fresh seed не создаёт baseline posts/comments, поэтому новый проект не воспроизводит reference-сценарий guest/list/post "из коробки".
2. API списка постов не возвращает `commentsCount`, из-за чего список не повторяет reference visual behavior.

## Неблокирующие отличия

1. Fullstack использует JWT, MongoDB и ObjectId вместо mock API и numeric role ids.
2. Demo credentials не совпадают с reference.
3. Часть backend error messages англоязычные.
4. Weather widget был отключён и не учитывался как parity blocker.

## Где fullstack лучше reference

1. Access control enforced backend middleware, а не только UI/BFF.
2. Есть чёткое разделение `401` и `403`.
3. Есть защита от удаления последнего admin.
4. Есть корректный cascade delete комментариев при удалении поста.

## Ограничения ревизии

1. Полноценный browser automation не использовался.
2. UI parity подтверждался комбинацией live API run и чтения frontend-кода.
3. Reference behavior брался из фактического кода reference-проекта и ранее подтверждённой reference-проверки, а не только из README.
