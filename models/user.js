import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  provider: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: process.env.NEXT_PUBLIC_NEXTAUTH_URL + '/profiles/default/default_avatar.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
  top_creator: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }), // for IST time
  },
  otp: {
    type: Number,
  }
});

const User = models.User || model('User', UserSchema);

export default User;