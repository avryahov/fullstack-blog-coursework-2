import { getPostsList } from '../services/post.service.js';

export const getPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const result = await getPostsList({ page, limit });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
