const express = require("express");
const {register,login,logout,adminregister,docterregister} = require("../controllers/usercontroller");
const usermiddleware = require("../middleware/usermiddleware");

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",usermiddleware,logout);
router.post("/admin/register",usermiddleware,adminregister);
router.post("/doctor/register",docterregister);

router.get("/check",usermiddleware,(req,res)=>{
    const reply={
        firstname:req.result.firstname,
        email:req.result.email,
        id:req.result._id
    };

    res.json({
        user:reply,
        message:"checked user successfully"
    });
});

module.exports = router;