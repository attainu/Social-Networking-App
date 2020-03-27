let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var confessionSchema = new Schema (
    {
        confession:{
            type:String,
            required:true
        }
    },
    {timestamps:true}
);

let Confession = mongoose.model("confession",confessionSchema);

module.exports = Confession;