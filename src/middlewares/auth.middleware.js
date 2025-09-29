import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const varifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];
        // console.log("Cookies:", req.cookies);
        // console.log("Authorization header:", req.headers["authorization"]);
        // console.log("Token to verify:", token);


        if (!token || typeof token !== "string") {
            throw new ApiError(401, "Unauthorized request — token missing or invalid");
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})

export { varifyJWT } 