import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "please provide videoId ");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video does not exist");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  let videoLike = undefined;
  if (!existingLike) {
    videoLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
  } else {
    videoLike = await Like.findByIdAndDelete(existingLike._id);
  }

  if (!videoLike) {
    throw new ApiError(400, "there is problem in creating video like");
  }

  res.status(200).json(new ApiResponse(200, videoLike, "like is ready."));
  //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
