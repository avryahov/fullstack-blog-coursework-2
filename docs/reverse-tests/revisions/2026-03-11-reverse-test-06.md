# Reverse Test Revision 06

Дата: 2026-03-11

Тип: automated ACL/UI guard coverage for protected frontend screens

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Цель

После runtime re-check и HTML regression fix добавить повторяемые automated checks на frontend guard behavior, чтобы protected screens не деградировали до простого route serving без реального deny-flow.

## Что добавлено

1. `Frontend/src/components/private-content/private-content.test.jsx`
2. `Frontend/src/pages/users/users.test.jsx`

## Что проверяют тесты

| Тест | Проверка | Результат |
|---|---|---|
| `private-content.test.jsx` | guest получает `Доступ запрещен`, admin видит protected content | `PASS` |
| `users.test.jsx` | guest не вызывает `roles/users` API, admin вызывает оба endpoint и видит список пользователей | `PASS` |

## Команда запуска

```bash
cd Frontend
CI=true npm test -- --runInBand --watch=false private-content.test.jsx users.test.jsx
```

## Замечания

1. Для `users.test.jsx` использованы локальные mocks API и child components, чтобы тест проверял именно ACL/UI guard behavior, а не сетевой слой или таблицу пользователей.
2. Проверка покрывает frontend guard semantics для `/users`, но не заменяет полноценный browser e2e по deep links и navigation.

## Вердикт

`PASS`
