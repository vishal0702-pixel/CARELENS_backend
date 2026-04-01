require("dotenv").config();

const express = require ("express");
 const main = require("./config/db");
const cookieParser = require("cookie-parser");
 const authroutes = require("./routes/userauthroute");
const redisclient = require("./config/redis");
const dashboardroute = require("./routes/userdashboard");

const cors = require("cors");


console.log("API KEY:", process.env.GOOGLE_API_KEY);
const app =  express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
 
app.use(express.json()); //convert th  json format  into  javascript  object  
app.use(cookieParser()); //convert the cookie into  js object  to understanding purpose ;
app.use('/user', authroutes);//go to the  page or routr  hhtp//localhost3000 / / user
app.use("/symptom" , dashboardroute)// now they  give me the  data of  what  user send and  what  result  t  wi ll  get  
const intializeconnection = async()=>{
   try{  
      await Promise.all([main(),redisclient.connect()]);
      console.log("both database connected ");
         app.listen( 3000, ()=>{
            console.log("databse connected and server listen  suceesfully at 6000")
       
      })

   }catch(err){
   console.log("error occur cant connect to database " + err);
}
}

intializeconnection();