import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  host: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  database: {
    type: String,
    required: true,
  },
  dialect: {
    type: String,
    required: true,
  },
  ssltsl: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["connected", "disconnected", "connecting", "disconnecting"],
    default: "disconnected",
  },
});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
