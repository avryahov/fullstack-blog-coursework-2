import { Comment, Post } from '../models/index.js';
import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';

const toCommentResponse = comment => ({
  id: comment.id,
  authorId: comment.authorId._id.toString(),
  author: comment.authorId.login,
  postId: comment.postId.toString(),
  content: comment.content,
  publishedAt: comment.publishedAt,
});

export const createPostComment = async ({ postId, authorId, content }) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw createHttpError(404, ERROR_MESSAGES.POST_NOT_FOUND);
  }

  const comment = await Comment.create({
    postId,
    authorId,
    content: content.trim(),
    publishedAt: new Date(),
  });

  const createdComment = await Comment.findById(comment.id).populate({ path: 'authorId', select: 'login' });

  return toCommentResponse(createdComment);
};

export const deleteCommentById = async commentId => {
  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw createHttpError(404, ERROR_MESSAGES.COMMENT_NOT_FOUND);
  }
};
