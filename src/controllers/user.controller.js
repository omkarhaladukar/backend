import { asyncHandler } from "../utils/asyncHandler.js"



const registerUser = asyncHandler(async (req, res) => {
    res.status(200)
    res.json(
        {
            message: "you did correctly"
        })
})

export { registerUser }