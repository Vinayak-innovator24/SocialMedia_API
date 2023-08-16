const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            max: 50,
        },
        desc: {
            type: String,
            required: true,
            max: 500,
        },
        comments: [{
            type: Schema.Types.ObjectId,
            default: [],
            ref: 'Comments'
        }],
        likes: [{
            type: Schema.Types.ObjectId,
            default: [],
            ref: 'User'
        }],
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);