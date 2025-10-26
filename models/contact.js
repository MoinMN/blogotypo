import { Schema, model, models } from 'mongoose';
import getISTTime from '@lib/time-ist';

const ContactSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
  },
  message: {
    type: String,
  },
  postedOn: {
    type: Date,
    default: getISTTime,
  }
});

const Contact = models.Contact || model('Contact', ContactSchema);

export default Contact;