import bcrypt from 'bcryptjs';
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { readDatabaseEnv } from '../config/env.js';
import { Comment, Post, Role, User } from '../models/index.js';
import { roleSeed } from './role-seed.js';

const referenceDbUrl = new URL('../../../../author-blog/db.json', import.meta.url);

const legacyRoleIdToKey = {
  0: 'admin',
  1: 'moder',
  2: 'reader',
  3: 'guest',
};

const extraSmokeUsers = [
  {
    login: 'moder',
    password: 'Moder#123',
    roleKey: 'moder',
    registeredAt: new Date('2026-03-10T09:30:00.000Z'),
  },
  {
    login: 'reader',
    password: 'Reader#123',
    roleKey: 'reader',
    registeredAt: new Date('2026-03-10T09:45:00.000Z'),
  },
];

const escapeHtml = text =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const plainTextToHtml = text => {
  const normalizedText = typeof text === 'string' ? text.trim() : '';

  if (!normalizedText) {
    return '<p></p>';
  }

  return normalizedText
    .split(/\n{2,}/)
    .map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');
};

const parseDate = (value, fallbackTime) => {
  if (typeof value !== 'string' || !value.trim()) {
    return new Date();
  }

  if (value.includes(' ')) {
    return new Date(value.replace(' ', 'T') + ':00.000Z');
  }

  return new Date(`${value}T${fallbackTime}.000Z`);
};

const loadReferenceDb = async () => {
  try {
    const raw = await readFile(referenceDbUrl, 'utf-8');

    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to read reference db.json at ${referenceDbUrl.pathname}: ${error.message}`);
  }
};

const createReferenceUsers = async (users, rolesByKey) => {
  const migratedUsers = await Promise.all(
    users.map(async user => {
      const roleKey = legacyRoleIdToKey[user.role_id] ?? 'guest';
      const password = user.login === 'admin' ? 'Admin#123' : user.password;

      return {
        sourceId: String(user.id),
        document: {
          login: user.login,
          passwordHash: await bcrypt.hash(password, 10),
          roleId: rolesByKey[roleKey].id,
          registeredAt: parseDate(user.registered_at, '12:00:00'),
        },
      };
    })
  );

  const smokeUsers = await Promise.all(
    extraSmokeUsers.map(async user => ({
      login: user.login,
      passwordHash: await bcrypt.hash(user.password, 10),
      roleId: rolesByKey[user.roleKey].id,
      registeredAt: user.registeredAt,
    }))
  );

  return {
    migratedUsers,
    smokeUsers,
  };
};

const createReferencePosts = posts =>
  posts.map(post => ({
    sourceId: String(post.id),
    document: {
      title: post.title,
      imageUrl: post.image_url || '',
      content: plainTextToHtml(post.content),
      publishedAt: parseDate(post.published_at, '12:00:00'),
    },
  }));

const createReferenceComments = ({ comments, userIdsBySourceId, postIdsBySourceId }) =>
  comments
    .map(comment => ({
      authorId: userIdsBySourceId.get(String(comment.author_id)),
      postId: postIdsBySourceId.get(String(comment.post_id)),
      content: comment.content,
      publishedAt: parseDate(comment.published_at, '12:00:00'),
    }))
    .filter(comment => comment.authorId && comment.postId);

const runReferenceSeed = async () => {
  const env = readDatabaseEnv();
  const referenceDb = await loadReferenceDb();

  await mongoose.connect(env.mongoUri);

  await Comment.deleteMany({});
  await Post.deleteMany({});
  await User.deleteMany({});
  await Role.deleteMany({});

  const roles = await Role.insertMany(roleSeed);
  const rolesByKey = Object.fromEntries(roles.map(role => [role.key, role]));
  const { migratedUsers, smokeUsers } = await createReferenceUsers(referenceDb.users, rolesByKey);
  const insertedReferenceUsers = await User.insertMany(migratedUsers.map(({ document }) => document));
  const userIdsBySourceId = new Map(insertedReferenceUsers.map((user, index) => [migratedUsers[index].sourceId, user.id]));

  await User.insertMany(smokeUsers);

  const migratedPosts = createReferencePosts(referenceDb.posts);
  const insertedPosts = await Post.insertMany(migratedPosts.map(({ document }) => document));
  const postIdsBySourceId = new Map(insertedPosts.map((post, index) => [migratedPosts[index].sourceId, post.id]));
  const migratedComments = createReferenceComments({
    comments: referenceDb.comments,
    userIdsBySourceId,
    postIdsBySourceId,
  });

  await Comment.insertMany(migratedComments);

  console.log(
    JSON.stringify(
      {
        importedFrom: referenceDbUrl.pathname,
        roles: roles.length,
        users: insertedReferenceUsers.length + smokeUsers.length,
        referenceUsers: insertedReferenceUsers.length,
        smokeUsers: smokeUsers.length,
        posts: insertedPosts.length,
        comments: migratedComments.length,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
};

runReferenceSeed().catch(async error => {
  console.error('Failed to run reference seed', error);

  try {
    await mongoose.disconnect();
  } catch {}

  process.exit(1);
});
