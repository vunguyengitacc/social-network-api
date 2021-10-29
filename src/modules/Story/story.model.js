import mongoose, { Schema } from "mongoose";

const StoryScheme = mongoose.Schema(
  {
    imageUrl: String,
    content: String,
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    isPrivate: Boolean,
    likeById: [{ type: Schema.Types.ObjectId, ref: "users" }],
    dislikeById: [{ type: Schema.Types.ObjectId, ref: "users" }],
    phone: String,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

StoryScheme.virtual("likes", {
  ref: "users",
  localField: "likeById",
  foreignField: "_id",
});

StoryScheme.virtual("dislikes", {
  ref: "users",
  localField: "dislikeById",
  foreignField: "_id",
});

StoryScheme.virtual("owner", {
  ref: "users",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const Story = mongoose.model("stories", StoryScheme);

export default Story;
