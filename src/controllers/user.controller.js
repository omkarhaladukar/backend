import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler(async (req, res) => {
    // get user from frontend
    // validation - not empty
    // check if already exist: username,email
    // check for images ,check for avatar
    // upload them to cloudinary, check avatar correctly uploaded
    // create user object- create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body
    console.log("email:", email);

    //    if(fullname===""){
    //     throw new ApiError(400,"fullname is required")
    //    }
    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All field required")
    }

    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;  // taking from multer uploaded over server in public/temp in original name
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;  // this one make comment

    // let coverImageLocalPath;   // when you get undefined error occur this comment  works & upper one make commet
    // if(req.files && Arrays.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    //     coverImageLocalPath=req.files.coverImage[0].path
    // }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );


})

export { registerUser }