let Comment = require("../models/Comment");
let Post = require("../models/Post");

module.exports = async (req, res, next) => {
    try {
        let user = req.user;
        let commentId = req.params.commentId;
        let postId = req.params.postId;
        let comment = await Comment.findOne({_id:commentId});
        let post = await Post.findOne({ _id: postId });   
        if(comment){
            if(comment.user.toString() === user._id.toString()){
                req.comment = comment
                next()
            }else{
                return res.status(401).json("You dont have access to this comment")
            }
        }else{
            return res.status().json("COMMENT NOT FOUND")
        }
        if(post){
            if(post.user.toString() === user._id.toString()){
                req.post = post
                next()
            }else{
                return res.status(401).json("You dont have access to this Post")
            }
        }
        else{
            return res.status().json("POST NOT FOUND")
        }
    }
    catch (error) {
        return res.status(500).json({ Error: error.message })
    }
}