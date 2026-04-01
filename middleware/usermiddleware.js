
const jsonwebtoken = require("jsonwebtoken");
const redisclient = require("../config/redis");
const User = require("../models/user");
require("dotenv").config;
const usermiddleware =  async(req , res , next)=>{
    //find the token  
  try{
     const{token} = req.cookies ;
   if(!token){
    throw new Error ("user doesn't exist ");
   }
    //make payload now 
    const payload = jsonwebtoken.verify(token , process.env.JWT_KEY);
    //get the user id  now fromthe  payload  ;
    const{_id} = payload ;
    if(!_id){
        throw new Error("user  not  found");
    }
    //now find the  user  of that  particular  id 
    const result  = await User.findById(_id);
    if(!result){
        throw new Error("usre not exist");
    }
    //check if the  token  is int the  blockedlist of  redis  or not  
    const isblocked = await redisclient.exists(`token:${token}`) ;
   //check is blocked
   if(isblocked){
    throw new Error("token is in blocked list");
   }

   req.result =  result ;
   next();
  }catch(err){
    res.status(401).send("user is invalid ");
    console.log("error occur user invalid"+err);
  }
}
module.exports = usermiddleware;