# Reverse Test Cases

Reference baseline: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Fullstack target: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## RT-ENV

| ID | Сценарий | Ожидаемый результат |
|---|---|---|
| RT-ENV-01 | Поднять MongoDB | Mongo доступен на `127.0.0.1:27017` |
| RT-ENV-02 | Поднять backend | API доступно на `127.0.0.1:3001/api` |
| RT-ENV-03 | Поднять frontend | UI доступен на `127.0.0.1:3000` |
| RT-ENV-04 | Fresh startup или ручной `seed` | Создан полный reference-state из `author-blog/db.json` |
| RT-ENV-05 | Повторный startup того же compose-контура | Данные не дублируются и не перетираются |

## RT-AUTH

| ID | Сценарий | Ожидаемый результат |
|---|---|---|
| RT-AUTH-01 | Login под admin | `200`, валидный JWT, роль admin |
| RT-AUTH-02 | Login под moder1 | `200`, валидный JWT, роль moder |
| RT-AUTH-03 | Login под alex_dev | `200`, валидный JWT, роль reader |
| RT-AUTH-04 | Wrong credentials | `401` |
| RT-AUTH-05 | `GET /auth/me` с токеном | `200`, возвращается текущий пользователь |
| RT-AUTH-06 | `GET /auth/me` без токена | `401` |
| RT-AUTH-07 | Register нового reader | `201`, новый reader создан |
| RT-AUTH-08 | Register duplicate login | `409` |
| RT-AUTH-09 | Invalid login/register body | `400` |

## RT-GUEST

| ID | Сценарий | Ожидаемый результат |
|---|---|---|
| RT-GUEST-01 | Открыть список постов | Доступ разрешён |
| RT-GUEST-02 | Открыть страницу поста | Доступ разрешён |
| RT-GUEST-03 | Проверить header | Нет admin кнопок |
| RT-GUEST-04 | Попытка комментирования | UI не даёт форму или backend возвращает `401` |
| RT-GUEST-05 | Прямой заход на `/users` | Ошибка доступа |
| RT-GUEST-06 | Прямой заход на `/post` | Ошибка доступа |
| RT-GUEST-07 | Прямой заход на `/post/:id/edit` | Ошибка доступа |

## RT-READER

| ID | Сценарий | Ожидаемый результат |
|---|---|---|
| RT-READER-01 | Login | Успешно |
| RT-READER-02 | Добавить комментарий | `201`, комментарий виден у поста |
| RT-READER-03 | Удалить комментарий | `403`, действие запрещено |
| RT-READER-04 | Создать пост | `403` |
| RT-READER-05 | Изменить пост | `403` |
| RT-READER-06 | Удалить пост | `403` |
| RT-READER-07 | Открыть `/users` | Ошибка доступа |
| RT-READER-08 | Запросить `/roles` | `403` |

## RT-MODER

| ID | Сценарий | Ожидаемый результат |
|---|---|---|
| RT-MODER-01 | Login | Успешно |
| RT-MODER-02 | Удалить комментарий | `204` |
| RT-MODER-03 | Создать пост | `403` |
| RT-MODER-04 | Открыть `/users` | Ошибка доступа |
| RT-MODER-05 | Запросить `/roles` | `403` |

## RT-ADMIN

| ID | Сценарий | Ожидаемый результат |
|---|---|---|
| RT-ADMIN-01 | Login | Успешно |
| RT-ADMIN-02 | Видит admin UI | Да |
| RT-ADMIN-03 | Создать пост | `201` |
| RT-ADMIN-04 | Открыть `/post/:id/edit` | Форма открывается |
| RT-ADMIN-05 | Проверить prefill формы edit | Текущие данные подставлены |
| RT-ADMIN-06 | Сохранить пост | `200`, данные меняются |
| RT-ADMIN-07 | Проверить список после save | Обновления видны |
| RT-ADMIN-08 | Удалить пост | `204`, пост исчезает из списка |
| RT-ADMIN-09 | Открыть `/users` | Доступ разрешён |
| RT-ADMIN-10 | Получить `/roles` | `200` |
| RT-ADMIN-11 | Изменить роль пользователя | `200` |
| RT-ADMIN-12 | Удалить пользователя | `204` |
| RT-ADMIN-13 | Удалить последнего admin | `409` |

## RT-NEGATIVE

| ID | Сценарий | Ожидаемый результат |
|---|---|---|
| RT-NEG-01 | `GET /posts/:missingId` | `404` |
| RT-NEG-02 | `GET /api/unknown-route` | `404` |
| RT-NEG-03 | `PATCH /users/:id/role` с невалидным `roleId` | `400` |
| RT-NEG-04 | Delete comment после cascade delete post | `404` |
| RT-NEG-05 | Ошибки логина/регистрации показываются в UI | Сообщение пользователю отображается |

## RT-PARITY

| ID | Сценарий | Ожидаемый результат |
|---|---|---|
| RT-PAR-01 | Guest parity | Список/страница поста доступны, admin UI скрыт |
| RT-PAR-02 | Reader parity | Может регистрироваться, логиниться, комментировать |
| RT-PAR-03 | Moder parity | Может удалять комментарии |
| RT-PAR-04 | Admin parity | Управляет постами, пользователями, ролями |
| RT-PAR-05 | UI hide + backend enforce | Не только скрытие кнопок, но и реальный отказ API |
| RT-PAR-06 | Архитектурные отличия | JWT/Mongo/ObjectId не считаются регрессией, если бизнес-поведение сохранено |
| RT-PAR-07 | Data parity | `roles/users/posts/comments` соответствуют reference `db.json` после schema-aware import |
