import { createPostComment, deleteCommentById } from '../services/comment.service.js';

export const createComment = async (req, res, next) => {
  try {
    const comment = await createPostComment({
      postId: req.params.id,
      authorId: req.user.id,
      content: req.body.content,
    });

    res.status(201).json({
      comment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await deleteCommentById(req.params.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
