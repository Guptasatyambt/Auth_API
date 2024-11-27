const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
    },
    name:{  
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        require:true,
        enum: ["user", "admin"],
        default: "user",
    }
},{timestamps:true});

const USER=mongoose.model('user',userSchema);

module.exports=USER;