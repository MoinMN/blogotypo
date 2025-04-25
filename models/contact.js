import { Schema, model, models } from 'mongoose';

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
    default: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  }
});

const Contact = models.Contact || model('Contact', ContactSchema);

export default Contact;