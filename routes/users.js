const User = require("../models/User");
const router = require("express").Router();

// get a user
router.get("/", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        res.status(200).json({email: user.email, followers: user.followers, following: user.followings})
    }
    catch(err){
        res.status(500).json(err);
    }
});

// follow a user
router.put("/follow/:id", async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email})
        const {_id} = user;
        if(!_id.equals(req.params.id)) {
            if (!user.followings.includes(req.params.id)) {
                await User.updateOne({_id: _id}, { $push: { followings: req.params.id } });
                await User.updateOne({_id: req.params.id}, { $push: { followers: _id } });
                res.status(200).json("you are now following this user");
            }
            else{
                res.status(403).json("you already follow this user");
            }
        }
        else{
            res.status(403).json("you can't follow yourself");
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
});

// unfollow a user
router.put("/unfollow/:id", async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email})
        const {_id} = user;
        if(!_id.equals(req.params.id)) {
            if (user.followings.includes(req.params.id)) {
                await User.updateOne({_id: _id}, { $pull: { followings: req.params.id } });
                await User.updateOne({_id: req.params.id}, { $pull: { followers: _id } });
                res.status(200).json("now you are now not following this user");
            }
            else{
                res.status(403).json("He's not in your following list");
            }
        }
        else{
            res.status(403).json("you can't unfollow yourself");
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router