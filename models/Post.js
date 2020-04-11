let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var postSchema = new Schema (
    {
        imgPath:{
            type:String,
            default:null
        },
        imgId:{
            type:String,
            default:null
        },
        status:{
            type:String,
            required:true
        },
        likes:[
            {
                type:Schema.Types.ObjectId,
                ref:"user"
            }
        ],
        comments:[
            {
                type:Schema.Types.ObjectId,
                ref:"comment",
                
            }
        ],
        user:{
                type:Schema.Types.ObjectId,
                ref:"user",
            }
    },
    {timestamps:true}
);

let Post = mongoose.model("post",postSchema);

module.exports = Post;