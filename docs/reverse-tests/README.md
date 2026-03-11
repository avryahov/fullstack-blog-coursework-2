# Reverse Tests

Каталог для reverse/parity-проверок fullstack-проекта относительно reference baseline.

## Структура

- `test-cases.md` — базовая матрица reverse-тестов для повторных прогонов
- `revisions/` — датированные ревизии с фактическими результатами запусков

## Правила ведения

1. Каждый новый прогон фиксируется отдельным файлом в `revisions/`.
2. Имя файла: `YYYY-MM-DD-reverse-test-XX.md`.
3. В ревизии обязательно фиксируются:
   - команды запуска;
   - окружение и порты;
   - использованные креды;
   - parity-таблицы;
   - negative testing;
   - blockers и допустимые отличия;
   - ограничения проверки.
4. Если меняется тестовая матрица, обновляется `test-cases.md`.

## Текущая история

- `2026-03-11-reverse-test-01.md` — первый baseline reverse-test для fullstack parity against `author-blog`
- `2026-03-11-reverse-test-02.md` — повторный reverse-test после фикса seed demo-state, `commentsCount` и error UX
- `2026-03-11-reverse-test-03.md` — post-merge runtime re-check по frontend deep links и backend ACL
