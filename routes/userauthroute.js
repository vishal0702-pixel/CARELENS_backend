const  express = require("express");
const {register , login , logout ,adminregister,docterregister }= require("../controllers/usercontroller");
const usermiddleware = require("../middleware/usermiddleware");
const  userauthrouter =  express.Router();
   

userauthrouter.post("/register" , register) ;
userauthrouter.post("/login" , login);
userauthrouter.post("/logout" ,usermiddleware ,  logout) ;
userauthrouter.post("/admin/register" , usermiddleware , adminregister);
userauthrouter.post("/doctor/register" ,docterregister);
userauthrouter.get("/check" , usermiddleware , (req,res)=>{

        const  reply = { 
            firstname : req.result.firstname ,
            emailID :req.result.emailID,
             id : req.result._id        }

             res.json({
                user:reply,
                message:"checked  user  sucessfully"
             })
    })
//userauthrouter.get("/getprofile" , getprofile)
module.exports = userauthrouter ;