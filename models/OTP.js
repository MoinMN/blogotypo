import { Schema, model, models } from "mongoose";
import getISTTime from '@lib/time-ist';

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: getISTTime,
    index: { expires: "5m" }, // Automatically delete after 5 mins
  },
}, { timestamps: true }); // Adds createdAt & updatedAt

const OTPModel = models.OTPModel || model("OTPModel", OTPSchema);

export default OTPModel;
