import mongoose, { Schema } from "mongoose";

const StoryScheme = mongoose.Schema(
  {
    imageUrl: String,
    content: String,
    userId: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

StoryScheme.virtual("owner", {
  ref: "users",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const Story = mongoose.model("stories", StoryScheme);

export default Story;
