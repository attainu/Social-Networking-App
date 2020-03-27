let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var userSchema = new Schema (
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
            trim:true
        },
        city:{
            type:String,
            required:true,
            trim:true
        },
        dob:{
            type:String,
            required:true
        },
        isConfirm:{
            type:Boolean,
            default:false
        },
        confirmToken:{
            type:String,
            default:null
        },
        posts:[
            {
                type:Schema.Types.ObjectId,
                ref:"post"
            }
        ],
        token:{
            type:String,
            default:null,
            trim:true
        }
    },
    {timestamps:true}
);

let User = mongoose.model("user",userSchema);

module.exports = User;