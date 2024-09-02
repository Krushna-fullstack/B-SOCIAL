import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    profileImg: {
      type: String,
      default: "",
    },

    coverImg: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },

    // likedPosts: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Post",
    //     default: [],
    //   },
    // ],

    department: {
      type: String,
      default: "",
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
