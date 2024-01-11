import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if(!content){
    throw new ApiError(401, "Content not provided");
  }
  const tweet = await Tweet.create({
    owner: req.user?._id,
    content,
  });

  if(!tweet){
    throw new ApiError(400, "Something went wrong while tweet");
  }

  return res.status(201)
  .json(new ApiResponse(200, tweet, "Tweet successfully created"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const {tweetId} = req.params;
  const {content} = req.body;

  if(!tweetId || !content){
    throw new ApiError(401, "Invalid tweetId or Content");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
    $set: {
        content
    }
  }, {new: true});

  if(!updatedTweet){
    throw new ApiError(401, "Something went wrong while updating a tweet")
  }

  return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet successfully updated"));

});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const {tweetId} = req.params;

  if(!tweetId){
    throw new ApiError(200, "Tweet id is invalid");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if(!deletedTweet){
    throw new ApiError(400, "Something went wrong while deleting the tweet")
  }

  return res.status(200).json(new ApiResponse(200, {}, "Tweet successfully deleted"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
