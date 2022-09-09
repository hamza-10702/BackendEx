import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

var authenticUser = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await userModel.findById(userID).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ Status: "Failed", Message: "Un Authorized User" });
    }
  }
  if (!token) {
    res.status(401).send({ Status: "Failed", Message: "Un Authorized User" });
  }
};

export default authenticUser;
