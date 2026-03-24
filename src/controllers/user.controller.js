import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // upload to cloudinary and check that there is no problem
  // create user object
  // in response remove password and refresh token
  // check that user is created or not
  //if yes then return response

  // get user details from frontend
  // validate that if not empty
  const { fullname, email, username, password } = req.body;
  if ([fullname, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("file has those data =>", req.files);
  // check if already exist or not :- username,email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "this email or username is in already use");
  }
  // check for avatar and image
  const avatarlocalpath = req.files?.avatar?.[0]?.path;
  const coverImagelocalpath = req.files?.coverImage?.[0]?.path;

  if (!avatarlocalpath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarlocalpath);
  const coverImage = await uploadOnCloudinary(coverImagelocalpath);

  if (avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  console.log(user);

  const createdUser = await user
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    console.log("user is not created");
    throw new ApiError(500, "user in not created by server");
  }
  console.log(user);

  return res.status(200).json(new ApiResponse(201, createdUser,"user registered successfully"));
});

export { registerUser };
