# Reverse Test Revision 08

Дата: 2026-03-11

Тип: full reverse regression run against `docs/reverse-tests/test-cases.md` after clean `docker compose down -> up --build`

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Цель

Подтвердить, что после merge состояния compose/proxy-контура в `dev` полный локальный regression run по reverse test-cases остается зеленым:
- стек поднимается воспроизводимо после полной остановки;
- API и ACL работают через единый proxy-вход `http://127.0.0.1:8080`;
- user-role сценарии `guest/reader/moder/admin` сохраняют parity-поведение;
- automated frontend coverage закрывает и UI guard-сценарии, и auth error rendering.

## Команды запуска

```bash
docker compose down
docker compose up --build -d
docker compose ps

node - <<'NODE'
# локальный API/proxy regression script по RT-AUTH / RT-GUEST / RT-READER / RT-MODER / RT-ADMIN / RT-NEG / RT-PAR
NODE

cd Frontend
CI=true npm test -- --runInBand --watch=false
```

## Что реально проверено

### Runtime and Proxy

| Проверка | Результат | Комментарий |
|---|---|---|
| `docker compose down` | `PASS` | стек полностью остановлен и удален без ручной очистки |
| `docker compose up --build -d` | `PASS` | стек поднялся повторно после полной остановки |
| `docker compose ps` | `PASS` | `mongo/backend/frontend/reverse-proxy` в состоянии `healthy` |
| Proxy entrypoint | `PASS` | проверки шли через `http://127.0.0.1:8080`, а не через прямые service ports |

### Reverse Test Matrix

| Блок | Результат | Комментарий |
|---|---|---|
| `RT-GUEST` | `PASS` | guest read-only сценарии и blocked comment action подтверждены |
| `RT-AUTH` | `PASS` | login/me/register/duplicate/invalid body подтверждены через реальный API |
| `RT-READER` | `PASS` | comment create работает, protected admin actions отклоняются |
| `RT-MODER` | `PASS` | moder может удалить комментарий, но не управляет posts/users/roles |
| `RT-ADMIN` | `PASS` | create/edit/delete post, users/roles access, role update, user delete и last-admin guard подтверждены |
| `RT-NEG` | `PASS` | missing resources, unknown route, invalid roleId и cascade delete проверены |
| `RT-PARITY` | `PASS` | parity-поведение по ролям и backend ACL enforcement подтверждено |

Итог API/proxy regression script:
- `53 / 53` сценариев матрицы отмечены как `PASS`;
- runtime-проверки шли после полного `down -> up`;
- для сценариев SPA route access использовался proxy shell + существующие/добавленные frontend tests на UI guards.

### Frontend Automated Regression

```text
Test Suites: 5 passed, 5 total
Tests:       8 passed, 8 total
```

Покрытые группы:
- `post-content.test.jsx`
- `post-form.test.jsx`
- `private-content.test.jsx`
- `users.test.jsx`
- `auth-pages.test.jsx`

## Отдельные наблюдения

1. Первый черновой API script дал ложные `400` из-за некорректных test payload-ов:
   - password для wrong-credentials не проходил валидацию формата;
   - login для register превышал backend limit `3..15`.
2. После приведения payload-ов к реальному контракту backend вся reverse-матрица прошла зелено.
3. Для `RT-NEG-05` теперь есть прямое automated подтверждение UI error rendering через `Frontend/src/pages/auth/auth-pages.test.jsx`, а не только косвенный вывод по backend status codes.

## Вердикт

`PASS`
