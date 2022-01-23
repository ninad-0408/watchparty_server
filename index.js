import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import { auth, socketAuth } from "./middlewares/auth.js";
import handleSocket from "./controllers/socketController.js";
import userRoute from "./routes/userRoute.js";
import roomRoute from "./routes/roomRoute.js";
<<<<<<< HEAD
import cookieParser from "cookie-parser";
=======
import videoSearchRoute from "./routes/videoSearchRoute.js";
>>>>>>> 94f196b614c1f46333484d6685abd4612c208265

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(cors( { origin: "*",credentials:true}));
app.use(cookieParser(process.env.hashtoken));
app.use(auth);

app.use("/user", userRoute);
app.use("/room", roomRoute);
app.post("/videoSearch", videoSearchRoute);

io.use(socketAuth);
io.on("connection", (socket) => handleSocket(io, socket));

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>
        server.listen(PORT, () =>
            console.log(`The server is running on port: ${PORT}`)
        )
    )
    .catch((error) => console.log(error.message));
