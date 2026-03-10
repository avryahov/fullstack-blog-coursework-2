import { createPostItem, getPostById, getPostsList } from '../services/post.service.js';

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

export const getPost = async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);

    res.status(200).json({
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await createPostItem(req.body);

    res.status(201).json({
      post,
    });
  } catch (error) {
    next(error);
  }
};
