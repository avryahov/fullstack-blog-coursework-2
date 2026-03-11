import { Comment, Post } from '../models/index.js';
import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';

const toPostListItem = post => ({
  id: post.id,
  title: post.title,
  imageUrl: post.imageUrl,
  publishedAt: post.publishedAt,
  commentsCount: post.commentsCount ?? 0,
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
  const postIds = posts.map(post => post._id);
  const commentsByPostId =
    postIds.length === 0
      ? new Map()
      : new Map(
          (
            await Comment.aggregate([
              {
                $match: {
                  postId: {
                    $in: postIds,
                  },
                },
              },
              {
                $group: {
                  _id: '$postId',
                  commentsCount: { $sum: 1 },
                },
              },
            ])
          ).map(({ _id, commentsCount }) => [_id.toString(), commentsCount])
        );

  return {
    posts: posts.map(post =>
      toPostListItem({
        ...post.toObject(),
        id: post.id,
        commentsCount: commentsByPostId.get(post._id.toString()) ?? 0,
      })
    ),
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

export const updatePostById = async (postId, { title, imageUrl, content }) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      title: title.trim(),
      imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
      content: content.trim(),
    },
    {
      new: true,
    }
  );

  if (!post) {
    throw createHttpError(404, ERROR_MESSAGES.POST_NOT_FOUND);
  }

  const comments = await Comment.find({ postId }).populate({ path: 'authorId', select: 'login' }).sort({ publishedAt: 1 });

  return {
    ...toPostDetail(post),
    comments: comments.map(toCommentItem),
  };
};

export const deletePostById = async postId => {
  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    throw createHttpError(404, ERROR_MESSAGES.POST_NOT_FOUND);
  }

  await Comment.deleteMany({ postId });
};

export const getPostById = async postId => {
  const [post, comments] = await Promise.all([
    Post.findById(postId),
    Comment.find({ postId }).populate({ path: 'authorId', select: 'login' }).sort({ publishedAt: 1 }),
  ]);

  if (!post) {
    throw createHttpError(404, ERROR_MESSAGES.POST_NOT_FOUND);
  }

  return {
    ...toPostDetail(post),
    comments: comments.map(toCommentItem),
  };
};
