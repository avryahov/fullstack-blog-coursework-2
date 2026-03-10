# Local MongoDB Container

На текущем этапе допускается только локальный контейнер MongoDB для проверки backend-подключения, моделей и seed.

## Что разрешено сейчас

- поднять отдельный контейнер MongoDB локально;
- использовать его для проверки `mongoose.connect(...)`;
- использовать его для локального запуска seed-скриптов;
- использовать его для ручной проверки backend в процессе разработки.

## Что пока не делаем

- не собираем docker-образы всего проекта;
- не создаем `docker-compose` для полного стека;
- не добавляем Nginx reverse proxy;
- не контейнеризуем frontend;
- не переходим к deployment-контуру.

## Рекомендуемый локальный запуск

```bash
docker run --name fullstack-blog-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=fullstack-blog-coursework-2 \
  -d mongo:8
```

## Остановка и удаление контейнера

```bash
docker stop fullstack-blog-mongo
docker rm fullstack-blog-mongo
```

## Для чего это нужно

- проверить, что backend подключается к MongoDB;
- проверить, что модели и индексы создаются корректно;
- подготовить базу для локального seed;
- не усложнять проект преждевременным DevOps-слоем.
