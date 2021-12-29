import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();

import userRoute from './routes/userRoute.js';
import auth from './middlewares/auth.js';

const app = express();

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(cors());

app.use(auth);
app.use('/user', userRoute);

app.get('/', (req,res) => res.status(200).json({user: req.user}));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => app.listen(PORT, () => console.log(`The server is running on port: ${PORT}`)))
	.catch((error) => console.log(error.message));