import mongoose from "mongoose";

const UserScheme = new mongoose.Schema(
  {
    fullname: String,
    username: {
      type: String,
      unique: true,
    },
    password: String,
    avatarUri: String,
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

UserScheme.index({ fullname: "text" });

const User = mongoose.model("users", UserScheme);

export default User;
