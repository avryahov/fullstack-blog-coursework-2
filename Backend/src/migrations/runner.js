import mongoose from 'mongoose';
import { Comment, Post, Role, User } from '../models/index.js';
import * as migration001 from './001-core-roles.js';
import * as migration002 from './002-reference-users.js';
import * as migration003 from './003-reference-posts-comments.js';
import * as migration004 from './004-clean-legacy-demo-state.js';
import * as migration005 from './005-reference-comment-source-keys.js';
import * as migration006 from './006-reconcile-reference-comments.js';

const migrationStateSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    firstAppliedAt: {
      type: Date,
      required: true,
    },
    lastAppliedAt: {
      type: Date,
      required: true,
    },
    runs: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    versionKey: false,
    collection: 'schema_migrations',
  }
);

const MigrationState = mongoose.models.MigrationState || mongoose.model('MigrationState', migrationStateSchema);

const migrations = [migration001, migration002, migration003, migration004, migration005, migration006];

export const getDatabaseSummary = async () => ({
  roles: await Role.countDocuments(),
  users: await User.countDocuments(),
  posts: await Post.countDocuments(),
  comments: await Comment.countDocuments(),
});

export const runMigrations = async () => {
  const applied = [];
  const skipped = [];

  for (const [index, migration] of migrations.entries()) {
    const existingState = await MigrationState.findOne({ key: migration.id });

    if (existingState) {
      skipped.push(migration.id);
      continue;
    }

    const now = new Date();

    await migration.up();

    await MigrationState.create({
      key: migration.id,
      description: migration.description,
      order: index + 1,
      firstAppliedAt: now,
      lastAppliedAt: now,
      runs: 1,
    });

    applied.push(migration.id);
  }

  return {
    applied,
    skipped,
    summary: await getDatabaseSummary(),
  };
};
