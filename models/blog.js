import { Schema, model, models } from 'mongoose';

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
    default: Date.now
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
      default: Date.now,
    }
  }],
  viewedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const Blog = models.Blog || model('Blog', BlogSchema);

export default Blog;