import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "../config/connectdb";
import userRoutes from './routes/userRoutes';

// const express = require('express')
// const cors = require('cors')
// require('dotenv').config();
// const http = require('http')
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;

connectDB(databaseURL);

app.use("/api/user", userRoutes)

app.listen(port, () => {
  console.log(`Server Listening at http://localhost:${port}`);
});
