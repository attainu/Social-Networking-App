let bufferConversion = require("../utils/bufferConversion");
let cloudinary = require("../utils/cloudinary");
let Post = require("../models/Post");
let Comment = require("../models/Comment");



module.exports = {
    getAllPosts:async (req,res) => {
        try {
            let posts = await Post.find({}).populate("user",["name"]).populate({path:"comments",populate:{path:"user"}});
            return res.status(200).json(posts); 
        } catch (error) {
            return res.status(200).json({Error:error.message})
        }
    },
    createPost: async (req, res) => {
        try {
            let user = req.user
            let userPostImg = bufferConversion(
                req.file.originalname,
                req.file.buffer
            );
            let userPostStatus = req.body.status;
            let imgResponse = await cloudinary.uploader.upload(userPostImg);
            let finalPost = {
                status: userPostStatus,
                imgPath: imgResponse.secure_url,
                imgId: imgResponse.public_id,
                user: user._id
            }
            let post = new Post({ ...finalPost });
            await post.save();
            user.posts.push(post._id);
            await user.save();
            return res.status(201).json(finalPost);
        }
        catch(error){
            return res.status(500).json(error.message)
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
            return res.status(200).json({likeLength:post.likes.length});
        } catch (error) {
            return res.status(500).json(error.message);
        }
    },
    updatePost: async (req, res) => {
        try {
            let post = req.post;
            let newPostStatus = req.body.status;
            await Post.updateOne({ _id: post._id }, { status: newPostStatus });
            return res.send("SUCCESS")
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    },
    deletePost: async (req, res) => {
        try{
            let post = req.post;
            await cloudinary.uploader.destroy(post.imgId);
            await Post.deleteOne({ _id: post._id });
            await Comment.deleteMany({post:post._id})
            res.send("done")
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    }
}

