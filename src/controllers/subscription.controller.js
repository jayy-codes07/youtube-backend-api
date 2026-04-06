import mongoose, { isValidObjectId } from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!channelId) {
        throw new ApiError(400, "provid channel id  properly")
    }
    const subscriber = await Subscription.find({ channel: channelId }).populate("subscriber", "fullname avatar username")

    if (!subscriber) {
        throw new ApiError(400, "Subscribers not found")
    }
    res.status(200).json(new ApiResponse(200, subscriber, "here are all Subscriber"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!subscriberId) {
        throw new ApiError(400, "provid subscriber id  properly")
    }
    const subscribed = await Subscription.find({ subscriber: subscriberId }).populate("subscriber", "fullname avatar username")

    if (!subscribed.length) {
        throw new ApiError(400, "Subscribed channels not found")
    }
    res.status(200).json(new ApiResponse(200, subscribed, "here are all Subscriber"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
