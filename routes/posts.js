const router = require("express").Router();
const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")
// checked
router.post("/", async (req, res) => {
    const {title, desc, email} = req.body;
    try {
        const currentTime = new Date();
        const {_id} = await User.findOne({email: email});
        const savedPost = await Post.create({title: title, desc: desc, createdAt: currentTime, createdBy: _id});
        const userCreatedPost = await User.findOneAndUpdate({email: email}, {"$push": { posts: savedPost._id }}); 
        res.status(200).json({savedPost, userCreatedPost});
    }
    catch (err){
        res.status(500).json(err);
    }
});

// (checked)
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        const user = await User.findOne({email: req.body.email});
        if(post) {
            const {createdBy} = post;
            console.log(createdBy);
            if(createdBy.equals(user._id)) {
                const result = await User.findOneAndUpdate({_id: createdBy}, {"$pull": post._id});
                await Post.findOneAndDelete({_id: req.params.id})
            } else {
                res.status(403).json("You can only delete your post")
                return;
            }   
        } else{
            res.status(403).json("Post not found")
            return;
        }
        res.status(200).json({msg: "Deleted"});
        return;
    }
    catch (err){
        res.status(500).json(err);
    }
})

// checked
router.put("/like/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.email)) {
            await post.updateOne({$push: { likes: req.body.email }});
            res.status(200).json("the post has been liked")
        }
    }
    catch (err){
        res.status(500).json(err);
    }
})
// checked
router.put("/unlike/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.likes.includes(req.body.email)) {
            await post.updateOne({$pull: { likes: req.body.email }});
            res.status(200).json("the post has been disliked")
        }
    }
    catch (err){
        res.status(500).json(err);
    }
})

router.get("/all_posts", async(req, res) => {
    try{
        const user = await User.findOne({email: req.body.email})
        .populate('posts')
        .populate(
            {
                path: 'posts',
                populate: {
                    path: 'comments',
                    model: 'Comment'
                }
            } ).exec();
        console.log(user);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

// checked
router.get("/:id", async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }

    catch (err){
        res.status(500).json(err);
    }
})

// comment for a post
router.put("/comment/:id", async (req, res) => {
    try{
        const post = await Post.findOne({_id: req.params.id});
        // console.log(comment);
        if(post) {
            const comment = await Comment.create({comment: req.body.comment})
            console.log(comment);
            const result = await Post.findOneAndUpdate({_id: req.params.id}, {$push: {comments: comment._id}});
            res.status(200).json({msg: comment._id});
        } else {
            res.status(401).json({msg: "Post isn't there"});
        }
        
    }
    catch (err){
        res.status(500).json(err);
    }
})

module.exports = router