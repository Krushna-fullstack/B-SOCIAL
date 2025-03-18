import asyncHandler from "../middlewares/asyncHandler.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { v2 as clodinary } from "cloudinary";

export const createPost = asyncHandler(async (req, res) => {
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

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
});

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await clodinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      // Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5; // Default limit is 10 posts

    // Get total posts count for wrapping pagination
    const totalPosts = await Post.countDocuments();

    // If there are no posts at all, return empty array
    if (totalPosts === 0) {
      return res.status(200).json({
        posts: [],
        totalPosts: 0,
        pagination: {
          currentPage: page,
          totalPages: 0,
          hasMore: false,
        },
      });
    }

    // Calculate skip with wrapping behavior
    // When we reach the end, we'll start over from the beginning
    const totalPages = Math.ceil(totalPosts / limit);
    const wrappedPage = ((page - 1) % totalPages) + 1;
    const skip = (wrappedPage - 1) * limit;

    

    // Find posts with wrapped pagination
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    // Create a response object
    const response = {
      posts,
      totalPosts,
      pagination: {
        currentPage: page,
        wrappedPage: wrappedPage,
        totalPages: totalPages,
        // Always true since we're implementing circular scrolling
        hasMore: true,
      },
    };

    // Set cache control headers to prevent caching issues
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getAllPosts controller: ", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    let { page, limit } = req.query;

    // Validate and parse pagination parameters
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 10)); // Limit to max 10 posts per request

    // Find the target user
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get total posts count for pagination
    const totalPosts = await Post.countDocuments({ user: user._id });

    // Calculate pagination values
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(totalPosts / limit);

    // Fetch posts with pagination
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    // Structure response to match getAllPosts format
    const response = {
      posts,
      totalPosts,
      pagination: {
        currentPage: page,
        totalPages,
        hasMore: page < totalPages,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getUserPosts controller: ", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
};

export const deleteComment = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );
  if (commentIndex === -1) {
    return res.status(404).json({ error: "Comment not found" });
  }

  post.comments.splice(commentIndex, 1);
  await post.save();

  res.status(200).json({ message: "Comment deleted successfully" });
});


