import { Schema, model, models } from 'mongoose';
import getISTTime from '@lib/time-ist';

const BlogSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  thumbnail_image: {
    type: String,
  },
  date: {
    type: Date,
    default: getISTTime, // for IST time
  },
  reviews: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    review: {
      type: String,
      required: [true, 'Comment is required!']
    },
    rating: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3, 4, 5]
    },
    date: {
      type: Date,
      default: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }), // for IST time
    }
  }],
  viewedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

BlogSchema.index({ date: -1 });
BlogSchema.index({ categories: 1 });
BlogSchema.index({ creator: 1 });

const Blog = models.Blog || model('Blog', BlogSchema);

export default Blog;