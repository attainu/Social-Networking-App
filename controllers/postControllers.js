let bufferConversion = require("../utils/bufferConversion");
let cloudinary = require("../utils/cloudinary");
let Post = require("../models/Post");


module.exports = {
    createPost: async (req, res) => {
        try {
            let user = req.user
            let userPostImg = bufferConversion(
                req.file.originalname,
                req.file.buffer
            );

            let userPostStatus = req.body.status;
            let imgResponse = await cloudinary.uploader.upload(userPostImg)
            console.log(imgResponse)
            let finalPost = {
                status: userPostStatus,
                imgPath: imgResponse.secure_url,
                imgId: imgResponse.public_id,
                user: user._id
            }
            let post = new Post({ ...finalPost })
            await post.save()
            return res.send(imgResponse)
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    },
    updatePost: async (req, res) => {
        try {
            let postId = req.params.postId
            let userPostStatus = req.body.status;
            await Post.updateOne({ _id: postId }, { status: userPostStatus })
            return res.send("done")
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    },
    deletePost: async (req, res) => {
        try{
            let postId = req.params.postId;
            let currentPost = await Post.findOne({ _id: postId });
            await cloudinary.uploader.destroy(currentPost.imgId)
            await Post.deleteOne({ _id: postId });
            res.send("done")
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    }
}

