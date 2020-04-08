let Comment = require("../models/Comment");
let Post = require("../models/Post")


module.exports = {
    createComment: async (req, res) => {
        try {
            let userId = req.user
            let postId = req.params.postId
            let userComment = req.body.comment;
            let finalComment = {
                post: postId,
                comment: userComment,
                user: userId
            }
            let comment = new Comment({ ...finalComment });
            await comment.save()
            let post = await Post.findOne({_id:postId})
            post.comments.push(comment._id);
            await post.save()
            return res.json({name:req.user.name ,comment:userComment})
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    },
    updateComment: async (req, res) => {
        try {
            let comment = req.comment;
            let newComment = req.body.comment;
            comment.comment = newComment;
            await comment.save();
            return res.status(200).json("UPDATED SUCCESSFULLY")
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    },
    deleteComment: async (req, res) => {
        try {
            let comment = req.comment;
            await Comment.deleteOne({_id:comment._id})
        }
        catch(error){
            return res.status(500).json(error.message)
        }
    }
}

