let Comment = require("../models/Comment");
let Post = require("../models/Post")


module.exports = {
    createComment: async (req, res) => {
        try {
            let userId = req.user._id
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
            return res.json(comment)
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    },
    updateComment: async (req, res) => {
        try {
            let userId = req.user._id;
            let newComment = req.body.comment
            let commentId = req.params.commentId;
            let comment = await Comment.findOne({_id:commentId});
            if(comment.user === userId){
                comment.comment = newComment;
                await comment.save()
            }
            res.send("done") 
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    },
    deleteComment: async (req, res) => {
        try {
            let userId = req.user._id;
            let commentId = req.params.commentId;
            let comment = await Comment.findOne({_id:commentId});
            if(comment.user === userId){
                await Comment.deleteOne({_id:commentId})
            }
            res.send("done") 
        }
        catch(error){
            return res.status(500).send(error.message)
        }
    }
}

