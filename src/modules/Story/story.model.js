import mongoose, { Schema } from "mongoose";

const StoryScheme = mongoose.Schema(
  {
    imageUrl: [String],
    content: String,
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    isPrivate: Boolean,
    phone: String,
    includeImage: Boolean,
    reactionId: [{ type: Schema.Types.ObjectId, ref: "reactions" }],
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

StoryScheme.virtual("reactions", {
  ref: "reactions",
  localField: "reactionId",
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
