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
        like:[
            {
                type:Schema.Types.ObjectId,
                ref:"user",
                default:null
            }
        ],
        comment:[
            {
                type:Schema.Types.ObjectId,
                ref:"user",
                default:null
            }
        ],
        user:{
                type:Schema.Types.ObjectId,
                ref:"user",
                default:null
            }
        
    },
    {timestamps:true}
);

let Post = mongoose.model("post",postSchema);

module.exports = Post;