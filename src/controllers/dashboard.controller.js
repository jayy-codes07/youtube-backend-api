import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
// import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "provide proper channel ID");
  }
  let subscribers = 0;
  const subscription = await Subscription.find({ channel: channelId });
  if (subscription.length > 0) {
    subscribers = subscription.length;
  }

  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "Likes",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        videoLikes: { $sum: { $size: "$Likes" } },
        videoViews: { $sum: "$views" },
      },
    },
  ];
  const video = await Video.aggregate(pipeline);
  if (!video) {
    throw new ApiError(400, "video data does not get");
  }
  const channelStates = {
    totalVideos: video[0]?.totalVideos || 0,
    videoLikes: video[0]?.videoLikes || 0,
    videoViews: video[0]?.videoViews || 0,
    totalSubscribers: subscribers,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelStates,
        "channel states like total views, subscribers, video, likes"
      )
    );
  //    TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const channelId = req.user?._id;
  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likedVideos",
      },
    },
    {
      $addFields: { videoLikes: { $size: "$likedVideos" } },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (parseInt(page) - 1) * parseInt(limit) },
    { $limit: parseInt(limit) },
    {
      $project: {
        title: 1,
        thumbnail: 1,
        views: 1,
        isPublished: 1,
        createdAt: 1,
        videoLikes: 1,
      },
    },
  ];

  const videos = await Video.aggregate(pipeline);

  if (videos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, videos, "there is no videos exist"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "here is channelVideos"));
});

export { getChannelStats, getChannelVideos };
