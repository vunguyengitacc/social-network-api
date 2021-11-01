import mongoose, { Schema } from "mongoose";

const NotificationScheme = mongoose.Schema(
  {
    message: String,
    toId: { type: Schema.Types.ObjectId, ref: "users" },
    fromId: { type: Schema.Types.ObjectId, ref: "users" },
    type: Number,
    active: Boolean,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    timestamps: true,
  }
);

NotificationScheme.virtual("to", {
  ref: "users",
  localField: "toId",
  foreignField: "_id",
  justOne: true,
});

NotificationScheme.virtual("from", {
  ref: "users",
  localField: "fromId",
  foreignField: "_id",
  justOne: true,
});

const Notification = mongoose.model("notifications", NotificationScheme);

export default Notification;
