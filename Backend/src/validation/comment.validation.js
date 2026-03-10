export const validateCommentBody = (req, _res, next) => {
  const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';

  if (!content) {
    const error = new Error('Comment content is required');
    error.statusCode = 400;
    return next(error);
  }

  if (content.length > 1000) {
    const error = new Error('Comment content is too long');
    error.statusCode = 400;
    return next(error);
  }

  return next();
};
