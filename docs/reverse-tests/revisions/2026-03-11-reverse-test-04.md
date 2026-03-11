# Reverse Test Revision 04

Дата: 2026-03-11

Тип: targeted regression fix after post-merge UI inspection

Reference project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/author-blog`

Target project: `/Users/avrjakhov/repositories/git/study/result-university/junior-frontend/fullstack-blog-coursework-2`

## Найденная регрессия

При чтении frontend-кода после post-merge runtime re-check обнаружился UI regression в post rendering/editing flow:

1. `Frontend/src/pages/post/components/post-content/post-content.jsx` выводил `content` как plain text, хотя backend и seed хранят HTML-строку (`<p>...</p>`).
2. `Frontend/src/pages/post/components/post-form/post-form.jsx` подставлял тот же HTML в `contentEditable` как обычный child, из-за чего admin edit prefill тоже отображал HTML-теги текстом.

Итог: просмотр и редактирование baseline posts могли визуально расходиться с reference behavior, несмотря на корректный backend payload.

## Исправление

1. Просмотр поста переведён на HTML rendering через `dangerouslySetInnerHTML`.
2. Prefill edit-формы переведён на прямую запись `innerHTML` в `contentEditable` через `ref + useLayoutEffect`.

## Проверка

| Проверка | Результат |
|---|---|
| Seed posts содержат HTML-разметку | подтверждено по `Backend/src/seeds/post-seed.js` |
| Post detail теперь рендерит HTML, а не литералы тегов | исправлено |
| Admin edit prefill теперь получает HTML-содержимое в editable area | исправлено |
| API-контракт backend не менялся | подтверждено |

## Затронутые файлы

1. `Frontend/src/pages/post/components/post-content/post-content.jsx`
2. `Frontend/src/pages/post/components/post-form/post-form.jsx`

## Ограничения проверки

1. DOM-level browser automation в среде по-прежнему не запускался, поэтому исправление валидировано по коду, структуре данных и согласованности с runtime payload.

## Вердикт

`FIXED`
