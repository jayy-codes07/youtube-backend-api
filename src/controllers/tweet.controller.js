import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(400, "there is no content available there ")
    }

    const tweet = await Tweet.create({ owner: req.user._id, content: content?.trim() })

    if (!tweet) {
        throw new ApiError(500, "there is problem in creating tweet")
    }

    res.status(201).json(new ApiResponse(201, tweet, "tweet created successfully"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // TODO: get user tweets
    const userAllComment = await Tweet.find({ owner: userId })

    if (!userAllComment?.length) {
        return res.status(200).json(new ApiResponse(200, [], "there is not tweets there "))
        
    }

    res.status(200).json(new ApiResponse(200, userAllComment, "here are all users"))
})

const updateTweet = asyncHandler(async (req, res) => {

    const { content } = req.body;
    const { tweetId } = req.params;

    if (!tweetId?.trim()) {
        throw new ApiError(400, "provide proper tweetId")
    }

    if (!content?.trim()) {
        throw new ApiError(400, "there is no content available there ")
    }


    const updatedtweet = await Tweet.findOneAndUpdate({ _id: tweetId, owner: req.user._id }, { $set: { content: content?.trim() } }, { new: true })

    if (!updatedtweet) {
        throw new ApiError(500, "there is problem in updating tweet")
    }

    res.status(200).json(new ApiResponse(200, updatedtweet, "tweet update successfully"))
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    if (!tweetId?.trim()) {
        throw new ApiError(400, "provide proper tweetId")
    }


    const tweetdelete = await Tweet.findOneAndDelete({ _id: tweetId, owner: req.user._id })

    if (!tweetdelete) {
        throw new ApiError(500, "proble in deleting tweet")
    }

    res.status(200).json(new ApiResponse(200, tweetdelete, "tweet deleted sucessfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
