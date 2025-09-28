import multer from "multer"


// disk storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")  // files path to store 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)  // we can update minor tweet and minor functionality 
    }
})

export const upload = multer({
    storage,
})

