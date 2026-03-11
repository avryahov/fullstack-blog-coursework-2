const seedDate = value => new Date(value);

export const postSeed = [
  {
    slug: 'migration-baseline-overview',
    title: 'Fullstack Blog: baseline demo state',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Эта стартовая статья нужна для reverse/parity-проверок. После <code>npm run seed</code> гость должен сразу видеть заполненный список постов и может открыть детальную страницу без дополнительной ручной подготовки данных.</p><p>Содержимое не копирует reference один в один, но воспроизводит тот же бизнес-сценарий: список постов, детальная страница, комментарии и роли работают на готовом demo-state.</p>',
    publishedAt: seedDate('2026-03-10T09:00:00.000Z'),
  },
  {
    slug: 'reader-comment-flow',
    title: 'Reader comment flow sanity check',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Этот пост используется для проверки сценариев reader/moder/admin. Reader может добавить комментарий, moderator и admin могут удалить его, а guest получает отказ по авторизации.</p>',
    publishedAt: seedDate('2026-03-09T12:30:00.000Z'),
  },
  {
    slug: 'admin-routing-and-acl',
    title: 'Admin routes and ACL smoke sample',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    content:
      '<p>Пост оставлен в seed для проверок create/edit/delete и визуального сравнения списка. Он помогает убедиться, что admin-маршруты работают, а non-admin доступ к ним не получают.</p>',
    publishedAt: seedDate('2026-03-08T08:15:00.000Z'),
  },
];

export const buildCommentSeed = ({ postsBySlug, usersByLogin }) => [
  {
    postId: postsBySlug['migration-baseline-overview'].id,
    authorId: usersByLogin.reader.id,
    content: 'На fresh seed список сразу выглядит живым. Это удобно для базовой parity-проверки.',
    publishedAt: seedDate('2026-03-10T09:20:00.000Z'),
  },
  {
    postId: postsBySlug['migration-baseline-overview'].id,
    authorId: usersByLogin.moder.id,
    content: 'Подтверждаю: этот пост подходит для smoke-check guest/list/post сценариев.',
    publishedAt: seedDate('2026-03-10T09:45:00.000Z'),
  },
  {
    postId: postsBySlug['reader-comment-flow'].id,
    authorId: usersByLogin.admin.id,
    content: 'Здесь удобно проверять разграничение прав на создание и удаление комментариев.',
    publishedAt: seedDate('2026-03-09T12:50:00.000Z'),
  },
];
