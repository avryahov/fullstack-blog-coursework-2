import { Comment, Post } from '../models/index.js';

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
    const error = new Error('Post not found');
    error.statusCode = 404;
    throw error;
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
    const error = new Error('Comment not found');
    error.statusCode = 404;
    throw error;
  }
};
