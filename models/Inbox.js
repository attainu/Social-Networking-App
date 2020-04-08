let mongoose = require("mongoose");


let Schema = mongoose.Schema;

var inboxSchema = new Schema(
    {
        user01: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        user02: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        conversation: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "user"
                },
                message: {
                    type: String,
                    trim: true
                },
                time: {
                    type: String,
                    trim: true
                },
                date: {
                    type: String,
                    trim: true
                }
            }
        ],
    }
);

let Inbox = mongoose.model("inbox", inboxSchema);

module.exports = Inbox;