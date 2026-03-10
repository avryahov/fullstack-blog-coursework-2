import { Comment, Post } from '../models/index.js';

const toPostListItem = post => ({
  id: post.id,
  title: post.title,
  imageUrl: post.imageUrl,
  publishedAt: post.publishedAt,
});

const toPostDetail = post => ({
  id: post.id,
  title: post.title,
  imageUrl: post.imageUrl,
  content: post.content,
  publishedAt: post.publishedAt,
});

const toCommentItem = comment => ({
  id: comment.id,
  authorId: comment.authorId?._id ? comment.authorId._id.toString() : comment.authorId.toString(),
  author: comment.authorId?.login || null,
  postId: comment.postId.toString(),
  content: comment.content,
  publishedAt: comment.publishedAt,
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

export const createPostItem = async ({ title, imageUrl, content }) => {
  const post = await Post.create({
    title: title.trim(),
    imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
    content: content.trim(),
    publishedAt: new Date(),
  });

  return {
    ...toPostDetail(post),
    comments: [],
  };
};

export const getPostById = async postId => {
  const [post, comments] = await Promise.all([
    Post.findById(postId),
    Comment.find({ postId }).populate({ path: 'authorId', select: 'login' }).sort({ publishedAt: 1 }),
  ]);

  if (!post) {
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    ...toPostDetail(post),
    comments: comments.map(toCommentItem),
  };
};
