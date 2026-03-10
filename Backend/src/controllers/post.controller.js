import { getPostsList } from '../services/post.service.js';

export const getPosts = async (_req, res, next) => {
  try {
    const posts = await getPostsList();

    res.status(200).json({
      posts,
    });
  } catch (error) {
    next(error);
  }
};
