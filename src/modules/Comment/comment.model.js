import mongoose, { Schema } from "mongoose";

const CommentScheme = mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    content: String,
    storyId: { type: Schema.Types.ObjectId, ref: "stories" },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

CommentScheme.virtual("owner", {
  ref: "users",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

CommentScheme.virtual("story", {
  ref: "stories",
  localField: "storyId",
  foreignField: "_id",
  justOne: true,
});

const Comment = mongoose.model("comments", CommentScheme);

export default Comment;
