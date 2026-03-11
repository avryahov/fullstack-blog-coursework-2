import { Comment, Post, User } from '../models/index.js';
import { loadReferenceDb, parseReferenceDate } from './reference-db.js';

export const id = '005-reference-comment-source-keys';
export const description = 'Backfill unique source keys for reference comments and restore duplicate comment ids from db.json';

const buildCommentSourceKey = comment =>
  [comment.id, comment.author_id, comment.post_id, comment.published_at, comment.content].map(value => String(value)).join('::');

export const up = async () => {
  try {
    await Comment.collection.dropIndex('sourceId_1');
  } catch (error) {
    if (error.codeName !== 'IndexNotFound') {
      throw error;
    }
  }

  await Comment.collection.createIndex({ sourceId: 1 }, { sparse: true });
  await Comment.collection.createIndex({ sourceKey: 1 }, { unique: true, sparse: true });

  const referenceDb = await loadReferenceDb();
  const [users, posts] = await Promise.all([
    User.find({ sourceId: { $exists: true, $ne: null } }),
    Post.find({ sourceId: { $exists: true, $ne: null } }),
  ]);
  const userIdsBySourceId = new Map(users.map(user => [user.sourceId, user.id]));
  const postIdsBySourceId = new Map(posts.map(post => [post.sourceId, post.id]));

  const commentOperations = referenceDb.comments
    .map(comment => {
      const authorId = userIdsBySourceId.get(String(comment.author_id));
      const postId = postIdsBySourceId.get(String(comment.post_id));

      if (!authorId || !postId) {
        return null;
      }

      return {
        updateOne: {
          filter: { sourceKey: buildCommentSourceKey(comment) },
          update: {
            $set: {
              sourceId: String(comment.id),
              sourceKey: buildCommentSourceKey(comment),
              authorId,
              postId,
              content: comment.content,
              publishedAt: parseReferenceDate(comment.published_at, '12:00:00'),
            },
          },
          upsert: true,
        },
      };
    })
    .filter(Boolean);

  if (commentOperations.length > 0) {
    await Comment.bulkWrite(commentOperations);
  }
};
