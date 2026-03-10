import { Post } from '../models/index.js';

const toPostListItem = post => ({
  id: post.id,
  title: post.title,
  imageUrl: post.imageUrl,
  publishedAt: post.publishedAt,
});

export const getPostsList = async ({ page, limit, search }) => {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
  const safeSearch = typeof search === 'string' ? search.trim() : '';
  const skip = (safePage - 1) * safeLimit;
  const query = safeSearch
    ? {
        title: {
          $regex: safeSearch,
          $options: 'i',
        },
      }
    : {};

  const [posts, total] = await Promise.all([
    Post.find(query).sort({ publishedAt: -1 }).skip(skip).limit(safeLimit),
    Post.countDocuments(query),
  ]);

  return {
    posts: posts.map(toPostListItem),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
    filters: {
      search: safeSearch,
    },
  };
};
