import { Comment, Post, User } from '../models/index.js';
import { postSeed } from '../seeds/post-seed.js';

const legacyDemoLogins = ['moder', 'reader'];
const legacyDemoPostTitles = postSeed.map(post => post.title);

export const id = '004-clean-legacy-demo-state';
export const description = 'Remove legacy demo baseline records that predate full reference db.json import';

export const up = async () => {
  const legacyDemoPosts = await Post.find({
    sourceId: { $exists: false },
    title: { $in: legacyDemoPostTitles },
  }).select('_id');
  const legacyDemoPostIds = legacyDemoPosts.map(post => post._id);

  if (legacyDemoPostIds.length > 0) {
    await Comment.deleteMany({ postId: { $in: legacyDemoPostIds } });
    await Post.deleteMany({ _id: { $in: legacyDemoPostIds } });
  }

  await User.deleteMany({
    sourceId: { $exists: false },
    login: { $in: legacyDemoLogins },
  });
};
