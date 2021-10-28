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
    job: String,
    education: [String],
    avatarUri: String,
    backgroundUrl: String,
    friendId: [{ type: Schema.Types.ObjectId, ref: "userId" }],
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

UserScheme.index({ fullname: "text" });

const User = model("users", UserScheme);
User.createIndexes();

export default User;
