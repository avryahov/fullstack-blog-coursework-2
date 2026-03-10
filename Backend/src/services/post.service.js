import { Post } from '../models/index.js';

const toPostListItem = post => ({
  id: post.id,
  title: post.title,
  imageUrl: post.imageUrl,
  publishedAt: post.publishedAt,
});

export const getPostsList = async ({ page, limit }) => {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;

  const [posts, total] = await Promise.all([
    Post.find().sort({ publishedAt: -1 }).skip(skip).limit(safeLimit),
    Post.countDocuments(),
  ]);

  return {
    posts: posts.map(toPostListItem),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
};
