import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import { auth, socketAuth } from "./middlewares/auth.js";
import userRoute from "./routes/userRoute.js";
import roomRoute from "./routes/roomRoute.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(cors());

app.use(auth);
app.use("/user", userRoute);
app.use("/room", roomRoute);

const PORT = process.env.PORT || 5000;

io.use(socketAuth);

var users = [];

io.on("connection", (socket) => {

    socket.on('new-member', (room) => {
        users.push({ _id: socket.user._id, username: socket.user.username, isAdmin: false, isHost: false });
        io.emit('member-connected', users);
    });

    socket.on('message', (message) => {
          socket.broadcast.emit('message', { username: socket.user.username, message: message })
    });

    socket.on('disconnect', () => {
      users = users.filter((e) => e._id !== socket.user._id ? e : null);
      io.emit('member-connected', users);
    })
});



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
