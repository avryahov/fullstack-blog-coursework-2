import { Comment, Post, User } from '../models/index.js';
import { loadReferenceDb, parseReferenceDate } from './reference-db.js';

export const id = '006-reconcile-reference-comments';
export const description = 'Reconcile legacy and source-keyed reference comments to a single full reference dataset';

const buildCommentSourceKey = comment =>
  [comment.id, comment.author_id, comment.post_id, comment.published_at, comment.content].map(value => String(value)).join('::');

export const up = async () => {
  const referenceDb = await loadReferenceDb();
  const [users, posts] = await Promise.all([
    User.find({ sourceId: { $exists: true, $ne: null } }),
    Post.find({ sourceId: { $exists: true, $ne: null } }),
  ]);
  const userIdsBySourceId = new Map(users.map(user => [user.sourceId, user._id]));
  const postIdsBySourceId = new Map(posts.map(post => [post.sourceId, post._id]));

  for (const comment of referenceDb.comments) {
    const authorId = userIdsBySourceId.get(String(comment.author_id));
    const postId = postIdsBySourceId.get(String(comment.post_id));

    if (!authorId || !postId) {
      continue;
    }

    const publishedAt = parseReferenceDate(comment.published_at, '12:00:00');
    const sourceId = String(comment.id);
    const sourceKey = buildCommentSourceKey(comment);
    const matches = await Comment.find({
      authorId,
      postId,
      content: comment.content,
      publishedAt,
    }).sort({ createdAt: 1, _id: 1 });

    if (matches.length === 0) {
      await Comment.create({
        sourceId,
        sourceKey,
        authorId,
        postId,
        content: comment.content,
        publishedAt,
      });
      continue;
    }

    const canonical = matches.find(item => item.sourceKey === sourceKey) || matches[0];

    canonical.sourceId = sourceId;
    canonical.sourceKey = sourceKey;
    canonical.authorId = authorId;
    canonical.postId = postId;
    canonical.content = comment.content;
    canonical.publishedAt = publishedAt;
    await canonical.save();

    const duplicateIds = matches.filter(item => item.id !== canonical.id).map(item => item._id);

    if (duplicateIds.length > 0) {
      await Comment.deleteMany({ _id: { $in: duplicateIds } });
    }
  }
};
