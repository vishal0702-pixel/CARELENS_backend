const  validator = require("validator")
const User  =require("../models/user");


const validate = (data)=>{
    const mandatoryfield = ["firstname", "email" ,  "password"];

    const  ispresent = mandatoryfield.every((k)=>Object.keys(data).includes(k));

    if(!ispresent){
        throw new Error("fill all the details")
    }
    //check the email is right format
    if(! validator.isEmail(data.email)){
        throw new Error("email is not valid");
    }
    //check the password strenght
    if(!validator.isStrongPassword(data.password)){
    throw new Error("password is not strong");
    }
}

module .exports = validate;