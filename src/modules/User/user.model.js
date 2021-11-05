import mongoose, { model, Schema } from "mongoose";

const UserScheme = new mongoose.Schema(
  {
    fullname: { type: String },
    username: {
      type: String,
      unique: true,
    },
    password: String,
    address: String,
    job: [String],
    education: [String],
    avatarUri: String,
    backgroundUrl: String,
    friendId: [{ type: Schema.Types.ObjectId, ref: "users" }],
    friendRequestId: [{ type: Schema.Types.ObjectId, ref: "users" }],
    friendWaitingId: [{ type: Schema.Types.ObjectId, ref: "users" }],
    phone: String,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, obj) => {
        delete obj.password;
        return obj;
      },
    },
    timestamps: true,
  }
);

UserScheme.virtual("friends", {
  ref: "users",
  localField: "friendId",
  foreignField: "_id",
});

UserScheme.virtual("friendRequests", {
  ref: "users",
  localField: "friendRequestId",
  foreignField: "_id",
});

UserScheme.virtual("friendWaitings", {
  ref: "users",
  localField: "friendWaitingId",
  foreignField: "_id",
});

UserScheme.index({ fullname: "text" });

const User = model("users", UserScheme);
User.createIndexes();

export default User;
