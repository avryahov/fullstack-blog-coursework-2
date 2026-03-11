# Frontend Parity Runbook

Этот runbook относится только к локальной parity-проверке frontend/fullstack относительно reference-проекта `author-blog`.

## Цель этапа

Подтвердить, что сценарии редактирования и удаления поста в новом full-stack проекте ведут себя так же, как в `author-blog`, с поправкой на реальный backend API и MongoDB.

## 1. Поднять MongoDB

Используйте локальный MongoDB на адресе:

```text
mongodb://127.0.0.1:27017/fullstack-blog-coursework-2
```

Если MongoDB не запущен как системный сервис, можно использовать один локальный контейнер:

```bash
docker run --name fullstack-blog-coursework-2-mongo \
  -p 27017:27017 \
  -d mongo:7
```

## 2. Поднять backend

```bash
cd Backend
cp .env.example .env
npm run seed
npm run dev
```

Ожидаемое поведение:
- backend слушает `http://localhost:3001`;
- `npm run seed` выполняет destructive reset и затем поднимает полный reference-state из `author-blog/db.json`;
- API доступно по префиксу `/api`.

## 3. Поднять frontend

Во втором терминале:

```bash
cd Frontend
npm start
```

Ожидаемое поведение:
- frontend открывается на `http://localhost:3000`;
- клиент обращается к backend API на `http://localhost:3001/api`.

## 4. Reference project

Для визуального и поведенческого сравнения при необходимости поднимите reference-проект отдельно:

```bash
cd /Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog
npm start
```

Запускайте его отдельно от parity-проверки и останавливайте после сравнения, чтобы не держать лишние процессы на MacBook Air.

## 5. Ручной parity-check

Минимальный сценарий:

1. Войти под `admin` / `admin123`.
2. Открыть существующий пост из списка.
3. Убедиться, что на странице поста доступны иконки редактирования и удаления.
4. Перейти по кнопке редактирования на `/post/:postId/edit`.
5. Изменить заголовок, ссылку на изображение или текст поста.
6. Сохранить пост и проверить возврат на `/post/:postId`.
7. Убедиться, что изменения видны на странице поста и в списке постов.
8. Снова открыть страницу поста и удалить его через modal confirm.
9. Проверить переход на главную и отсутствие удаленного поста в списке.
10. Если у поста были комментарии, убедиться, что после удаления пост больше не открывается.

Дополнительная сверка с `author-blog`:
- guest не должен видеть admin-кнопки;
- admin должен видеть тот же edit/delete flow;
- форма редактирования должна быть предзаполнена текущими данными поста.

## 6. Что считать blocker

Blocker для merge в `dev`:
- не открывается `/post/:postId/edit`;
- форма редактирования не предзаполняется данными поста;
- сохранение не обновляет пост через backend API;
- удаление не удаляет пост из backend/MongoDB;
- поведение admin/guest отличается от `author-blog` без объяснимой причины миграции.
