import { ERROR_MESSAGES, createHttpError } from '../utils/http-error.js';

export const validatePostBody = (req, _res, next) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
  const imageUrl = req.body?.imageUrl;

  if (!title) {
    return next(createHttpError(400, ERROR_MESSAGES.POST_TITLE_REQUIRED));
  }

  if (!content) {
    return next(createHttpError(400, ERROR_MESSAGES.POST_CONTENT_REQUIRED));
  }

  if (title.length > 150) {
    return next(createHttpError(400, ERROR_MESSAGES.POST_TITLE_TOO_LONG));
  }

  if (content.length > 20000) {
    return next(createHttpError(400, ERROR_MESSAGES.POST_CONTENT_TOO_LONG));
  }

  if (imageUrl !== undefined && typeof imageUrl !== 'string') {
    return next(createHttpError(400, ERROR_MESSAGES.POST_IMAGE_INVALID));
  }

  return next();
};
