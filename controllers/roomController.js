import bcrypt from 'bcryptjs';
import { serverError } from '../alerts/errors.js';

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
    const {roomId}=req.params;
	var room = await roomModel.findOne({ open: true,_id:roomId }, ["name", "host"])
		.populate("host", "name")
		.then((data) => {
			return res.status(200).json({ room: data });
		})
		.catch((error) => {
			console.log("Database Disconnected");
			return dataUnaccesable(res);
		});
};

