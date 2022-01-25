import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const auth = (req, res, next) => {

    const token = req.cookies.token;

    if(token)
    req.user = jwt.verify(token, process.env.hashtoken);
    next();

};

export const socketAuth = (socket, next) => {

    const token = socket.handshake.headers.authorization?.split(' ')[1];

    if(token)
    {
        socket.user = jwt.verify(token, process.env.hashtoken);
        next();
    }

};
