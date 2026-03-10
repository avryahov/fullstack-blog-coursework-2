import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

postSchema.index({ title: 'text' });

export const Post = mongoose.model('Post', postSchema);
