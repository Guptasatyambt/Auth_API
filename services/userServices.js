const jwt=require("jsonwebtoken")

const asyncHandler=require('express-async-handler')
function setuser(user) {
   return jwt.sign({
    _id:user._id,
    email:user.email,
    role:user.role,
   },process.env.secret)
}

const validation = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
 
    if (authHeader && authHeader.startsWith("Bearer")) {
       token = authHeader.split(" ")[1];
       if (!token) {
          res.status(401);
          throw new Error("Unauthorized User");
       }
 
       jwt.verify(token, process.env.secret, (err, decoded) => {
          if (err) {
             res.status(401);
             throw new Error("Unauthorized user");
          }
 
          req.user = decoded;
 
          // Role-based access control can be added here
          next();
       });
    } else {
       res.status(401);
       throw new Error("No token provided");
    }
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