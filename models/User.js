const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: true,
            min: 6
        },
        followers: [{
            type: Schema.Types.ObjectId,
            default: [],
            ref: 'User'
        }],
        followings: [{
            type: Schema.Types.ObjectId,
            default: [],
            ref: 'User'
        }],
        posts: [{
            type: Schema.Types.ObjectId,
            default: [],
            ref: 'Post'
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);