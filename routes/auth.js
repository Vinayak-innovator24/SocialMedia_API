const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
let jwtSecretKey = process.env.SECRET_KEY;
// Register
const hashedPassword = async(password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

router.post("/", async (req, res) => {
    try{
        const {password, email} = req.body;
        const information = await User.findOne({email: email});
        if(information) {
            if(bcrypt.compareSync(password, information.password) ) {
                const token = jwt.sign({ email: email }, jwtSecretKey);
                res.status(200).json({token: token, _id: information._id});
            } else {
                res.status(403).json({msg: "Unauthorized"});
            }
        } else {
            const hash = await hashedPassword(password);
            const user = await User.create({email: email, password: hash});
            const token = jwt.sign({ email: email, password: password }, jwtSecretKey);
            res.status(200).json({token: token, _id: user._id});
        }
    } 
    catch (err) {
        console.log(err);
    }
});

module.exports = router