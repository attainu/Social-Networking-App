let mongoose = require("mongoose");


let Schema = mongoose.Schema;

var inboxSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        friend: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        conversation: [
            {
                name: {
                    type: String,
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