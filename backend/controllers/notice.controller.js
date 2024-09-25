import { Notice } from "../models/notice.model.js";
import { User } from "../models/user.model.js";
import asyncHandler from "./../middlewares/asyncHandler.js";
import { v2 as clodinary } from "cloudinary";

export const createNotice = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Text or image is required" });
    }

    if (img) {
      const uploadedResponse = await clodinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newNotice = new Notice({
      user: userId,
      text,
      img,
    });

    await newNotice.save();

    res.status(201).json(newNotice);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createNotice controller: ", error);
  }
});

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    if (notice.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this notice" });
    }

    if (notice.img) {
      const imgId = notice.img.split("/").pop().split(".")[0];
      await clodinary.uploader.destroy(imgId);
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in deleteNotice controller: ", error);
  }
};

export const likeUnlikeNotice = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: noticeId } = req.params;

    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    const userLikedNotice = notice.likes.includes(userId);

    if (userLikedNotice) {
      // Unlike Notice
      notice.likes = notice.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await notice.save();

      await User.updateOne(
        { _id: userId },
        { $pull: { likedNotices: noticeId } }
      );

      res.status(200).json(notice.likes);
    } else {
      // Like Notice
      notice.likes.push(userId);
      await notice.save();

      await User.updateOne(
        { _id: userId },
        { $push: { likedNotices: noticeId } }
      );

      res.status(200).json(notice.likes);
    }
  } catch (error) {
    console.log("Error in likeUnlikeNotice controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).populate({
      path: "user",
      select: "-password",
    });

    if (notices.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(notices);
  } catch (error) {
    console.log("Error in getAllNotices controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
