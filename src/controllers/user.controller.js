import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// generate access and refresh token
const generateAccessTokenAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (err) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}


// register user
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
    // console.log("email:", email);

    if (fullName === "") {
        throw new ApiError(400, "fullname is required")
    }
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
})  // register user done

// login user

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email 
    // find the user already exist
    //check password 
    // access and refreshtoken send to user
    // send cookies done 

    const { email, username, password } = req.body
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "use does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credential")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
        select(
            "-password -refreshToken")

    const isProd = process.env.NODE_ENV === "production";

    const options = {
        httpOnly: true,
        secure: isProd,        // only true in production
        sameSite: "Strict",    // prevent CSRF
        path: "/"              // ensures cookie is sent on all routes
    };


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)   // ✅ fixed
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,   // ✅ fixed
                    refreshToken
                },
                "User logged in successfully"
            )
        )
}) // login in done


// log out user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/",          // ensure cookie works across routes

    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logout successfully"))
}) // logout done



export { registerUser, loginUser, logoutUser }