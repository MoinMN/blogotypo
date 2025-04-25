import { Schema, model, models } from "mongoose";

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
    default: () => new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }), // Convert to IST & add 5 min expiration
    index: { expires: "5m" }, // Automatically delete after 5 mins
  },
}, { timestamps: true }); // Adds createdAt & updatedAt

const OTPModel = models.OTPModel || model("OTPModel", OTPSchema);

export default OTPModel;
