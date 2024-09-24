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
