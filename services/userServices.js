const jwt=require("jsonwebtoken")

const asyncHandler=require('express-async-handler')
function setuser(user) {
   return jwt.sign({
    _id:user._id,
    email:user.email,
    role:user.role,
   },process.env.secret)
}

const validation=asyncHandler(async(req,res,next)=>{
    let token;
    let authheader=req.headers.Authorization || req.headers.authorization
    if(authheader &&authheader.startsWith("Bearer")){
        token=authheader.split(" ")[1];
        if(!token){
            res.status(401);
            throw new Error("Anuthrised User");
        }
        jwt.verify(token,process.env.secret,(err,decode)=>{
            if(err){
                res.status(401)
                throw new Error("Anauthrised user")
            }
            req.user=decode;
            next();
    
        })
        
    }
    // res.status(400).json("Invalid token");
    });

 const authorizeRoles = (...roles) => {
    return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
          res.status(403);
          throw new Error("Access denied: You do not have the required permissions");
       }
       next();
    };
 };

module.exports={
    setuser,validation,authorizeRoles
}