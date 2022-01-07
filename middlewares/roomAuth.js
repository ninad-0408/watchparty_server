import roomModel from '../models/roomModel.js';
import bcrypt from 'bcryptjs';
import { serverError, wrongPassword } from '../alerts/errors.js';

const roomAuth = async (req, res, next) => {

    const { roomId } = req.params;

    await roomModel.findById(roomId)
        .then((room) => {
            if(room.open)
            next();
            else if(room.isPassword)
            {
                const { password } = req.body;
                bcrypt.compare(password, room.password)
                    .then((check) => {
                        if(check)
                        next();
                        else
                        return wrongPassword(res);
                    })
                    .catch((error) => {
                        console.log(error);
                        return serverError(res);
                    })

            }
            else
            {
                if(room.allowedUsers.indexOf(req.user.username) === -1)
                {
                    let err = new Error();
                    err.message = 'You are not allowed to join this room contact host.';
                    err.status = 401;
                    return res.status(err.status).json({ err });
                }
                else
                next();
            }
        })

}

export default roomAuth;