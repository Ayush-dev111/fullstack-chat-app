import express from "express";
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv'
import { connectDb } from "./lib/database.js";
import cookieParser from "cookie-parser"

const PORT = process.env.PORT || 3500;
const app = express();
dotenv.config();
connectDb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
