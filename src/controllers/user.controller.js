import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // create user object
  // in response remove password and refresh token
  // check that user is created or not
  //if yes then return response

  // get user details from frontend

  //  get data from body
  const { fullname, email, username, password } = await req.body;
  // validate that if not empty
  if ([fullname, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // check if already exist or not :- username,email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "this email or username is in already use");
  }

  // check for avatar and coverImage
  const avatarlocalpath = await req.files?.avatar?.[0]?.path;
  let coverImagelocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagelocalpath = req.files.coverImage[0].path;
  }

  // if there is no avatar we will sent error
  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar is required");
  }

  // upload it to Cloudinary
  const avatar = await uploadOnCloudinary(avatarlocalpath);
  const coverImage = await uploadOnCloudinary(coverImagelocalpath);

  // check that avatar is sent to Cloudinary or not
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  // insert user into database
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  // remove password and refresh token
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(user);

  // check that user is created or not
  if (!createdUser) {
    console.log("user is not created");
    throw new ApiError(500, "user in not created by server");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "user registered successfully"));
});

export { registerUser };
