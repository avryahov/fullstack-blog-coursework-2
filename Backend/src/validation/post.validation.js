export const validatePostBody = (req, _res, next) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
  const imageUrl = req.body?.imageUrl;

  if (!title) {
    const error = new Error('Post title is required');
    error.statusCode = 400;
    return next(error);
  }

  if (!content) {
    const error = new Error('Post content is required');
    error.statusCode = 400;
    return next(error);
  }

  if (title.length > 150) {
    const error = new Error('Post title is too long');
    error.statusCode = 400;
    return next(error);
  }

  if (content.length > 20000) {
    const error = new Error('Post content is too long');
    error.statusCode = 400;
    return next(error);
  }

  if (imageUrl !== undefined && typeof imageUrl !== 'string') {
    const error = new Error('Post imageUrl must be a string');
    error.statusCode = 400;
    return next(error);
  }

  return next();
};
