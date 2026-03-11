import { ROLE } from '../constant';

const formatDate = value => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const mapRole = role => ({
  id: role.id,
  key: role.key,
  name: role.name,
});

export const mapUser = (user, token = null) => ({
  id: user.id,
  login: user.login,
  roleId: user.role?.key || ROLE.GUEST,
  role: user.role ? mapRole(user.role) : null,
  registeredAt: user.registeredAt ? formatDate(user.registeredAt) : '',
  session: token,
});

export const mapComment = comment => ({
  id: comment.id,
  author: comment.author || 'Unknown',
  authorId: comment.authorId,
  postId: comment.postId,
  content: comment.content,
  publishedAt: formatDate(comment.publishedAt),
});

export const mapPost = post => ({
  id: post.id,
  title: post.title,
  imageUrl: post.imageUrl || '',
  content: post.content || '',
  publishedAt: formatDate(post.publishedAt),
  comments: post.comments ? post.comments.map(mapComment) : [],
  commentsCount: typeof post.commentsCount === 'number' ? post.commentsCount : null,
});
