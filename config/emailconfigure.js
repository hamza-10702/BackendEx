import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


let transporter = nodemailer.createTransport({
    host: process.env.EMIAL_HOST,
    port: process.env.EMIAL_PORT,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass:  process.env.EMAIL_PASS, // generated ethereal password
    },
  });


  export default transporter;