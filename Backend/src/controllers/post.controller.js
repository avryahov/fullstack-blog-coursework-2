import { getPostsList } from '../services/post.service.js';

export const getPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const result = await getPostsList({ page, limit, search });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
