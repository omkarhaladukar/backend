const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
    };
}


export { asyncHandler }

// const asyncHandler=(func)=>{}
// const asyncHandler=(func)=>()=>{}
// const asyncHandler=(func)=> async ()=>{}
    
// wrapper function

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }

