let jwtSecretKey = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken")
/**
 * 
 * @param {Request} req 
 * @param {*} res 
 * @param {*} next 
 */
const middleware = async(req, res, next) => {
    const token = req.headers["authorization"];
    const verified = jwt.verify(token, jwtSecretKey);
    if(verified){
        req.body.email = verified.email;
        next();
    }else{
        res.status(403).send({msg: "unauthorized"});
    }
}

module.exports = {middleware}