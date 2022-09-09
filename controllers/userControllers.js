import mongoose from "mongoose";
import userModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class userController {
  static userRegister = async (req, res) => {
    const { name, email, password, confirmPassword, tc } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", Message: "Email Already used" });
    } else {
      if (name && email && password && confirmPassword && tc) {
        if (password === confirmPassword) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const user = new userModel({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            await user.save();
            const savedUser = await userModel.findOne({ email: email });
            const token = jwt.sign(
              { userID: savedUser._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );
            res.status(201).send({
              status: "Success",
              Message: "User Successfully signUp",
              Token: token,
            });
          } catch (error) {
            console.log(error);
            res.send({ status: "Failed", Message: "Unable to Register" });
          }
        } else {
          res.send({
            status: "Failed",
            Message: "Password and Confirm Password doesn't matched",
          });
        }
      } else {
        res.send({ status: "failed", Message: "All Field are filled" });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await userModel.findOne({ email: email });
        if (user != null) {
          const isMatched = bcrypt.compare(password, user.password);
          if (user.email === email && isMatched) {
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "2d" }
            );
            res.send({ status: "Success", Message: "Welcome", Token: token });
          } else {
            res.send({
              status: "Failed",
              Message: "Invalid Email or Password",
            });
          }
        } else {
          res.send({ status: "Failed", Message: "User must be Registered" });
        }
      } else {
        res.send({ status: "Failed", Message: "All fields must required" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "Failed", Message: "Enable to Login" });
    }
  };

  static changePassword = async (req, req) => {
    const { password, confirmPassword } = req.body;
    if (password && confirmPassword) {
      if (password === confirmPassword) {
         const salt  = await bcrypt.genSalt(10);
         const newHashPassword  = await bcrypt.hash(password , salt);
         await userModel.findByIdAndUpdate(req.user._id, {$set:{password:newHashPassword}});
         res.send({"Status" : "Failed" , "Message" : "Password Succesfuly Changed"})
      } else {
        req.send({ Status: "Failed", Message: "Password and confirm password Matched" });
      }
    } else {
      req.send({ Status: "Failed", Message: "All field must be filled" });
    }
  };

  static logedInUser = (req ,res) =>{
     res.send({"UserID":req.user})
  }


  static sendResetEmail = async (req, res) =>{
    const {email} = req.body;
    if(email){
      const user = await userModel.findOne({email: email});
      if(user){
          const secret = user._id + process.env.JWT_SECRET_KEY;
          const token = jwt.sign({userID: user._id} , secret , {expiresIn: '15m'});
          const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
          console.log(link);

          let info = await transporter.sendMail({
            from: '"process.env.EMAIL_FROM', 
            to: user.email, 
            subject: "Password reset Link",
            text: "Dear User!", 
            html: "<b>Click Here</b>", 
          });
          res.send({"Status": "Success" , "Message" : "Password Reset... Check Email"})

      }else{
        res.send({"Status": "Failed" , "Message" :"Email does not exist"})
      }

    }else{
      res.send({"Status": "Failed" , "Message" : "Email Required"})
    }
  }


  static passwordReset = async (req , res) =>{
    const {password , confirmPassword} = req.body;
    const {id, token} = req.params;
    const user = await userModel.findById(id);
    const verifySecretKey = user._id + process.env.JWT_SECRET_KEY;
    try{
      jwt.verify(token , verifySecretKey)
    if(password && confirmPassword){
        if(password === confirmPassword){
              const salt =await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(salt , password);
              await userModel.findByIdAndUpdate(user._id , {$set : {password:hashPassword}});
              res.send({ "Status": "success", "Message": "Password Reset Successfully" })
        } else{        
          res.send({"Status": "Failed", "Message" :"Password does not matched"})
        }
      }else{
        res.send({"Status": "Failed", "Message" :"All Field must required"})
      }
    }
      catch(error){
       console.log(error)
       res.send({"Status": "Failed", "Message" :"Token Expired"})
      }
  }
}

export default userController;
