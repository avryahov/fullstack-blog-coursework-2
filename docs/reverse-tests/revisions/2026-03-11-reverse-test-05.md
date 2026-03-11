# Reverse Test Revision 05

Дата: 2026-03-11

Тип: targeted regression coverage for post HTML rendering/edit prefill

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Цель

После фикса ревизии 04 добавить повторяемую automated check, чтобы regression с HTML-контентом в post detail и admin edit prefill не вернулась незаметно.

## Что добавлено

1. `Frontend/src/setupTests.js` с подключением `@testing-library/jest-dom`.
2. `Frontend/src/pages/post/components/post-content/post-content.test.jsx`
3. `Frontend/src/pages/post/components/post-form/post-form.test.jsx`

## Что проверяют тесты

| Тест | Проверка | Результат |
|---|---|---|
| `post-content.test.jsx` | HTML-контент поста рендерится как DOM, а не как строка с тегами | `PASS` |
| `post-form.test.jsx` | `contentEditable` в admin edit form получает HTML prefill через `innerHTML` | `PASS` |

## Команда запуска

```bash
cd Frontend
CI=true npm test -- --runInBand --watch=false post-content.test.jsx post-form.test.jsx
```

## Ограничения и наблюдения

1. Для текущего CRA/Jest toolchain понадобились локальные mocks для `react-router-dom`, `components` и `api`, потому что проект использует `react-router-dom@7` и ESM `axios`, а этот стек в тестах не поднимается прозрачно из коробки.
2. Ограничение касается test harness, а не runtime приложения: production build и live runtime до этого проходили успешно.

## Вердикт

`PASS`
