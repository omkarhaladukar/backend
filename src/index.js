// require('dotenv').config({ path: './env' })
// index.js
import dotenv from 'dotenv';
dotenv.config({ path: './env' });

import connectDB from './db/index.js';
import app from './app.js';  

connectDB()
    .then(() => {
        app.on("error", (err) => {
            console.log("ERROR:", err);
            throw err;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("MONGODB CONNECTION FAILED:", err);
    });




// import express from 'express';
// const app = express();

// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (err) => {
//             console.log("ERROR:", error);
//             throw err;
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`app listening on port", ${process.env.PORT}`);
//         })
//     } catch (err) {
//         console.error("ERROR:", err);
//     }
// })()