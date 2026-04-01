const User = require("../models/user");
const Doctor = require("../models/doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisclient = require("../config/redis");

const register = async(req,res)=>{
try{

const {firstname,email,password,gender,bloodgroup,age}=req.body;

const hashed = await bcrypt.hash(password,10);

const user = await User.create({
    firstname,
    email,
    password:hashed,
    gender,
    bloodgroup,
    age,
    role:"user"
});

const token = jwt.sign(
{_id:user._id,email:user.email,role:user.role},
process.env.JWT_KEY,
{expiresIn:"1h"}
);

res.cookie("token",token,{
httpOnly:true,
secure:true,
sameSite:"none",
maxAge:60*60*1000
});

res.status(201).json({
message:"User registered successfully"
});

}catch(err){
console.log(err);
res.status(500).json({message:"Registration failed"});
}
};

const login = async(req,res)=>{
try{

const {email,password}=req.body;

const user = await User.findOne({email});

if(!user){
return res.status(404).json({message:"User not found"});
}

const match = await bcrypt.compare(password,user.password);

if(!match){
return res.status(401).json({message:"Incorrect password"});
}

const token = jwt.sign(
{_id:user._id,email:user.email,role:user.role},
process.env.JWT_KEY,
{expiresIn:"1h"}
);

res.cookie("token",token,{
httpOnly:true,
secure:true,
sameSite:"none",
maxAge:60*60*1000
});

res.json({
message:"Login successful",
user
});

}catch(err){
console.log(err);
res.status(500).json({message:"Login failed"});
}
};

const logout = async(req,res)=>{
try{

const {token}=req.cookies;

if(!token){
return res.status(401).send("User not logged in");
}

const payload = jwt.verify(token,process.env.JWT_KEY);

await redisclient.set(`token:${token}`,"blocked");
await redisclient.expireAt(`token:${token}`,payload.exp);

res.clearCookie("token");

res.send("Logged out successfully");

}catch(err){
console.log(err);
res.status(500).send("Logout failed");
}
};

const adminregister = async(req,res)=>{
try{

const {firstname,email,password}=req.body;

const hashed = await bcrypt.hash(password,10);

const admin = await User.create({
firstname,
email,
password:hashed,
role:"admin"
});

res.status(201).json({
message:"Admin registered",
admin
});

}catch(err){
console.log(err);
res.status(500).send("Admin registration failed");
}
};

const docterregister = async(req,res)=>{
try{

const hashed = await bcrypt.hash(req.body.password,10);

const doctor = await Doctor.create({
...req.body,
password:hashed,
role:"doctor"
});

const token = jwt.sign(
{id:doctor._id},
process.env.JWT_KEY,
{expiresIn:"7d"}
);

res.cookie("token",token,{
httpOnly:true,
secure:true,
sameSite:"none"
});

res.json({
success:true,
message:"Doctor Registered Successfully"
});

}catch(err){
console.log(err);
res.status(500).json({
success:false,
message:err.message
});
}
};

module.exports={
register,
login,
logout,
adminregister,
docterregister
};