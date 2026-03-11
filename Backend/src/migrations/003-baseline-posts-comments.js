import { Comment, Post, User } from '../models/index.js';
import { buildCommentSeed, postSeed } from '../seeds/post-seed.js';

export const id = '003-baseline-posts-comments';
export const description = 'Ensure baseline posts and comments exist for smoke and parity checks';

export const up = async () => {
  const postOperations = postSeed.map(post => ({
    updateOne: {
      filter: { title: post.title },
      update: {
        $set: {
          imageUrl: post.imageUrl,
          content: post.content,
          publishedAt: post.publishedAt,
        },
        $setOnInsert: {
          title: post.title,
        },
      },
      upsert: true,
    },
  }));

  if (postOperations.length > 0) {
    await Post.bulkWrite(postOperations);
  }

  const posts = await Post.find({ title: { $in: postSeed.map(post => post.title) } });
  const postsBySlug = Object.fromEntries(
    postSeed
      .map(post => [post.slug, posts.find(storedPost => storedPost.title === post.title)])
      .filter(([, post]) => Boolean(post))
  );
  const usersByLogin = Object.fromEntries((await User.find({ login: { $in: ['admin', 'moder', 'reader'] } })).map(user => [user.login, user]));
  const comments = buildCommentSeed({ postsBySlug, usersByLogin });

  for (const comment of comments) {
    await Comment.updateOne(
      {
        postId: comment.postId,
        authorId: comment.authorId,
        content: comment.content,
        publishedAt: comment.publishedAt,
      },
      {
        $setOnInsert: comment,
      },
      {
        upsert: true,
      }
    );
  }
};
