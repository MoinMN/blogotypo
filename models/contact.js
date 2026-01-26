import { Schema, model, models } from "mongoose";
import getISTTime from "@lib/time-ist";

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    subject: {
      type: String,
      trim: true,
      maxlength: [100, "Subject too long"],
      default: "Contact Form Submission",
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message too long"],
    },

    postedOn: {
      type: Date,
      default: getISTTime,
    },
  },
  { timestamps: true, }
);

const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;