let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var commentSchema = new Schema (
    {
        post:{
            type:Schema.Types.ObjectId,
            ref:"post"
        },
        comment:{
            type:String,
            required:true
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:"user"
        }
    },
    {timestamps:true}
);

let Comment = mongoose.model("comment",commentSchema);

module.exports = Comment;