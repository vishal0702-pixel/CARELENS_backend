const  express =  require("express");
const User =  require("../models/user")
const validate =  require("../utilis/validate");
const bcrypt = require("bcrypt");
const  jsonwebtoken = require("jsonwebtoken");
const redisclient = require("../config/redis");
const Doctor = require("../models/doctor");
require("dotenv").config();
//regidter function 
const  register   = async(req, res)=>{

  try{ 
     //validate the things like email and password ;

     validate(req.body);
    const{firstname ,  email ,  password , gender ,  bloodgroup ,age} =  req.body ;
     //now check hashed the  password ;

     req.body.password = await bcrypt.hash(password ,  10);
     req.body.role= "user"
     const user = await User.create(req.body);

     //now make the token  ; 
    const token =  jsonwebtoken.sign({ _id:user.id  , email : email , role : user}, process.env.JWT_KEY, {expiresIn : 60*60});
    //now  send the  cookie 
   res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    
    res.status(201).send( "user register succesfully");
  }catch(err){
      
          console.log("user not register some error  occur"+ err);
        
  }
}
//login function 


const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Incorrect password"
      });
    }

    // create token
    const token = jsonwebtoken.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // send cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user
    });

  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({
      message: "Login failed"
    });
  }
};



//logout function
const logout = async (req, res) => {
  try {

    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("User not logged in");
    }

    const payload = jsonwebtoken.verify(token, process.env.JWT_KEY);
   //redis set  the  blocked token  
    await redisclient.set(`token:${token}`, "blocked");
   //  expire the  automaticall y  when its  expire date comes
    await redisclient.expireAt(`token:${token}`, payload.exp);

    res.clearCookie("token");

    res.status(200).send("Logged out successfully");

  } catch (err) {
    console.log("Logout error:", err);
    res.status(500).send("Logout failed");
  }
};


//admin  registeration 

const  adminregister =  async(req,  res)=>{
  try {
    const{role}= req.result.body;
    if( role!=admin){
      throw new  Error (" admin not  found ");
    }
    // validate the the  things now 
    validate(req.result);
    // take out the thing  now  to  register the  admin ;
    const{firstname  , email , password }= req.body ;
    //bcyrpt the  password ;
    req.body,password = await bcrypt.hash(password ,  10 );
    //nake the user  now as  admin 
    req.body.role =  admin ;
    const  user  =  await  User.create(req.body);
    // now mkae the toke  now 
    const  token =  jsonwebtoken.sign({_id:user.id , email:email , role:admin} , process.env.JWT_KEY , {expiresIn:60*60});
    //stire the  token in cookies  
    res.cookie('token', token , {maxAge:60*60*1000});
    //now respise msg 
    res.status(201).send("admin succesfully  register ");
    
  }catch(err){
    console.log("not  register admin")
  }
}

//doctor  registeration 


const docterregister = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      fees,
      hospital,
      address,
      availableDays,
      availableTime,
      about,
      image
    } = req.body;

    

     req.body.password= await bcrypt.hash(password, 10);
  req.body.role = "doctor";
  const  doctor = await Doctor.create(req.body);

    const token = jsonwebtoken.sign(
      { id: doctor._id },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.json({
      success: true,
      message: "Doctor Registered Successfully",
      token
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};



//get profie function 

const  getprofile =  async(req ,res)=>{
  try{

  }catch{

  }
}

module.exports = {register ,  login  , logout , adminregister , docterregister };