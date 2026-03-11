import mongoose from 'mongoose';
import { readDatabaseEnv } from '../config/env.js';
import { Comment, Post, Role, User } from '../models/index.js';
import { roleSeed } from './role-seed.js';
import { buildCommentSeed, postSeed } from './post-seed.js';
import { buildUserSeed } from './user-seed.js';

const runSeed = async () => {
  const env = readDatabaseEnv();

  await mongoose.connect(env.mongoUri);

  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});
  await Role.deleteMany({});
  const roles = await Role.insertMany(roleSeed);
  const rolesByKey = Object.fromEntries(roles.map(role => [role.key, role]));
  const users = await buildUserSeed(rolesByKey);
  const insertedUsers = await User.insertMany(users);
  const usersByLogin = Object.fromEntries(insertedUsers.map(user => [user.login, user]));
  const insertedPosts = await Post.insertMany(postSeed);
  const postsBySlug = Object.fromEntries(insertedPosts.map((post, index) => [postSeed[index].slug, post]));
  const comments = buildCommentSeed({ postsBySlug, usersByLogin });

  await Comment.insertMany(comments);

  await mongoose.disconnect();
};

runSeed().catch(error => {
  console.error('Failed to run seed', error);
  process.exit(1);
});
