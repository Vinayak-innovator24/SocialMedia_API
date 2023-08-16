const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const CommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);