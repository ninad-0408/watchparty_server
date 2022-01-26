import mongoose from "mongoose";
import { notLoggedIn, notValid } from "../alerts/errors.js";

export const isLoggedIn = (req, res, next) => {
    if(req.user)
    return next();
    else
    return notLoggedIn(res);

};

export const isValid = (req, res, next) => {

    const { roomId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(roomId))
    return notValid(res);
    else
    next();
};