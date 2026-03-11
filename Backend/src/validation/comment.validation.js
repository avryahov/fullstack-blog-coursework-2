import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';

export const validateCommentBody = (req, _res, next) => {
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';

  if (!content) {
    return next(createHttpError(400, ERROR_MESSAGES.COMMENT_CONTENT_REQUIRED));
  }

  if (content.length > 1000) {
    return next(createHttpError(400, ERROR_MESSAGES.COMMENT_CONTENT_TOO_LONG));
  }

  return next();
};
