let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        dob: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String,
            default: "https://clipartart.com/images/default-profile-picture-clipart-3.jpg"
        },
        isConfirm: {
            type: Boolean,
            default: false
        },
        confirmToken: {
            type: String,
            default: null
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: "post"
            }
        ],
        token: {
            type: String,
            default: null,
            trim: true
        },
        sentRequests: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "user",

                },
                isAccepted: {
                    type: Boolean,
                    default: false
                }
            }
        ]
        ,
        receivedRequests: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "user",
                },
                isAccepted: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
                
            }
        ]
    },
    { timestamps: true }
);

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.confirmToken;
    delete user.__v;
    return user;
};

let User = mongoose.model("user", userSchema);

module.exports = User;

