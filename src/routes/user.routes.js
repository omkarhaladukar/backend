import { Router } from 'express';
import { loginUser, registerUser, logoutUser, refreshAccessToken, ChangeCurrentPassword, getCurrentUser, upadateAccountDetails, upadateUserAvatar, upadateUserCoverImage, getUserChannerProfile, getWatchHistory } from '../controllers/user.controller.js';
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([   // middleware inject
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
    registerUser);

router.route("/login").post(loginUser)

// secure routes
router.route("/logout").post(varifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);  // no need to verify token here , you need to want apply
router.route("/change-password").post(varifyJWT, ChangeCurrentPassword);
router.route("/current-user").get(varifyJWT, getCurrentUser);
router.route("/update-account").patch(varifyJWT, upadateAccountDetails);
router.route("/avatar").patch(varifyJWT, upload.single("avatar"), upadateUserAvatar);
router.route("/coverImage").patch(varifyJWT, upload.single("coverImage"), upadateUserCoverImage);
router.route("/c/:username").get(varifyJWT, getUserChannerProfile);
router.route("/history").get(varifyJWT, getWatchHistory);

export { router };  
