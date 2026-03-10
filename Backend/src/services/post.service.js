import { Post } from '../models/index.js';

const toPostListItem = post => ({
  id: post.id,
  title: post.title,
  imageUrl: post.imageUrl,
  publishedAt: post.publishedAt,
});

export const getPostsList = async () => {
  const posts = await Post.find().sort({ publishedAt: -1 });

  return posts.map(toPostListItem);
};
