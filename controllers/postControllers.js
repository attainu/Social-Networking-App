let bufferConversion = require("../utils/bufferConversion");
let cloudinary = require("../utils/cloudinary");
let Post = require("../models/Post");


module.exports = {
    getPost:async (req,res) => {
        let posts = await Post.find({}).populate("user",["name"]).populate({path:"comments",populate:{path:"user"}})
        //let posts = await Post.find({}).populate("user",["name"]).populate("comments",["comment"])
        res.send(posts);
    },
    createPost: async (req, res) => {
        try {
            let user = req.user
            let userPostImg = bufferConversion(
                req.file.originalname,
                req.file.buffer
            );
            console.log(req.body)

            let userPostStatus = req.body.status;
            let imgResponse = await cloudinary.uploader.upload(userPostImg)
            let finalPost = {
                status: userPostStatus,
                imgPath: imgResponse.secure_url,
                imgId: imgResponse.public_id,
                user: user._id
            }
            let post = new Post({ ...finalPost });
            await post.save()
            user.posts.push(post._id);
            await user.save();
            return res.json(finalPost)
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    },
    likeUnlikePost:async (req,res) =>{
        try {
            let userId = req.user._id;
            let postId = req.params.postId;
            let post = await Post.findOne({_id:postId});
            let likeIndex = post.likes.indexOf(userId )
            if(likeIndex === -1){
                post.likes.push(userId)
                await post.save()
            }
            else{
                post.likes.splice(likeIndex,1)
            }
            await post.save()
            return res.json({likeLength:post.likes.length})
        } catch (error) {
            return res.status(500).send(error.message)
        }
    },
    updatePost: async (req, res) => {
        try {
            let postId = req.params.postId;
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

