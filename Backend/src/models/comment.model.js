import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    sourceId: {
      type: String,
      sparse: true,
      trim: true,
    },
    sourceKey: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

commentSchema.index({ postId: 1, publishedAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);
