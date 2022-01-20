import bcrypt from 'bcryptjs';
import { notAuthorized, notValid, serverError,dataUnaccesable } from '../alerts/errors.js';

import roomModel from '../models/roomModel.js';

export const createRoom = async (req, res) => {
    
    var body = req.body;
    body.host = req.user._id;
    // console.log(body);
    // check if password is enabled
    if(body.password)
    {
        body.isPassword = true;
        body.open = false;
        await bcrypt.hash(body.password, 4)
            .then((data) => {
                body.password = data;
            })
            .catch((error) => {
                console.log(error);
                return serverError(res);
            });
    }

	// creating room
	await roomModel.create(body)
		.then((data) => {
			delete data.password;
            return res.status(200).json({ room: data, message: "Room is created successfully." });
        })
        .catch((error) => {
            console.log(error);
            return serverError(res);
        });

};

export const patchRoom = async (req, res) => {

    const { roomId } = req.params;

};

export const delRoom = async (req, res) => {
    const { roomId } = req.params;

    roomModel.findById(roomId)
        .then((data) => {
            if(data)
            {
                if(req.user._id == data.host)
                {
                    roomModel.findByIdAndDelete(roomId)
                        .then(() => {
                            return res.status(200).json({ message: 'Room deleted successfully.' });
                        })
                        .catch((error) => {
                            console.log(error);
                            return serverError(res);
                        });
                }
                else
                return notAuthorized(res);
            }
            else
            return notValid(res);
        })
        .catch((error) => {
            console.log(error);
            return serverError(res);
        });

};

export const getRooms = async (req, res) => {

	roomModel.find({ open: true }, ["name", "host"])
		.populate("host", "username")
		.then((data) => {
			return res.status(200).json({ rooms: data });
		})
		.catch((error) => {
			console.log(error);
			return dataUnaccesable(res);
		});
};

export const getRoom = async (req, res) => {
    const { roomId } = req.params;
	roomModel.findById(roomId, ["name", "host", "isPassword", 'open', 'lock'])
		.then((data) => {
			return res.status(200).json({ room: data });
		})
		.catch((error) => {
			console.log(error);
			return dataUnaccesable(res);
		});
};

export const myRoom = async (req,res) => {
    try{
        const myrooms = await roomModel.find({host:req.user._id},["name"]);
        res.status(200).json({myrooms});
    }
    catch(error)  {
        return dataUnaccesable(res);
    };
    

}