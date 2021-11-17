import mongoose, { Schema } from "mongoose";

const ReactionScheme = mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    storyId: { type: Schema.Types.ObjectId, ref: "stories" },
    reactType: Number,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

ReactionScheme.virtual("owner", {
  ref: "users",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

ReactionScheme.virtual("story", {
  ref: "stories",
  localField: "storyId",
  foreignField: "_id",
  justOne: true,
});

const Reaction = mongoose.model("reactions", ReactionScheme);

export default Reaction;
