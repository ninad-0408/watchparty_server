import { notLoggedIn } from "../alerts/errors.js";

export const isLoggedIn = (req, res, next) => {
    if(req.user)
    return next();
    else
    return notLoggedIn(res);

};