import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    SenderID: {
      type: String,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "file"],
      default: "text",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
