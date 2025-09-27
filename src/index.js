// require('dotenv').config({ path: './env' })
import dotenv from 'dotenv';

dotenv.config({path:'./env'})

import mongoose from 'mongoose';
import { DB_NAME } from './constants.js'
import connectDB from './db/index.js';

connectDB();

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