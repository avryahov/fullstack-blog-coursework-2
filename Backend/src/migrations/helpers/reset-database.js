import { Comment, Post, Role, User } from '../../models/index.js';

export const resetDatabase = async () => {
  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});
  await Role.deleteMany({});
  await User.db.collection('schema_migrations').deleteMany({});
};
