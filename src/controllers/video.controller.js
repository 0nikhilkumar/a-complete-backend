import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if (!title || !description) {
    throw new ApiError(401, "title and description is required");
  }

  let videoLocalFilePath, thumbnailLocalFilePath;
  if (
    req.files &&
    Array.isArray(req.files?.videoFile) &&
    req.files?.videoFile.length > 0
  ) {
    videoLocalFilePath = req.files.videoFile[0].path;
  }
  if (
    req.files &&
    Array.isArray(req.files?.thumbnail) &&
    req.files?.thumbnail.length > 0
  ) {
    thumbnailLocalFilePath = req.files.thumbnail[0].path;
  }

  const videoFile = await uploadOnCloudinary(videoLocalFilePath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalFilePath);

  if (!videoFile) {
    throw new ApiError(400, "Video File is required");
  }
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: Math.floor(videoFile.duration),
    owner: req.user?._id,
  });

  if (!video) {
    throw new ApiError(400, "Something went wrong while uploading the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video is successfully upload"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!videoId) {
    throw new ApiError(401, "Video Id is required");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video is not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video successfully fetched"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  //TODO: update video details like title, description, thumbnail
  if (!videoId) {
    throw new ApiError(401, "Video Id is required");
  }

  if (!title || !description) {
    throw new ApiError(401, "title or description is not entered");
  }

  let videoLocalFilePath, thumbnailLocalFilePath;
  if (
    req.files &&
    Array.isArray(req.files?.videoFile) &&
    req.files?.videoFile.length > 0
  ) {
    videoLocalFilePath = req.files.videoFile[0].path;
  }

  if (
    req.files &&
    Array.isArray(req.files?.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalFilePath = req.files.thumbnail[0].path;
  }

  const videoFile = await uploadOnCloudinary(videoLocalFilePath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalFilePath);

  if (!thumbnail || !videoFile) {
    throw new ApiError(401, "Both thumbnail and video file is required");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
      },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(400, "something went wrong while updating");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Successfully Updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    throw new ApiError(401, "Video Id is required");
  }

  const videoDelete = await Video.findByIdAndDelete(videoId);

  if (!videoDelete) {
    throw new ApiError(400, "Video is not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Successfully deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video id is not found");
  }

  const videoStatus = await Video.findById(videoId);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !videoStatus.isPublished,
      },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video is not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, `Video is successfully ${video.isPublished ? "published" : "Unpublished"}`)
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
