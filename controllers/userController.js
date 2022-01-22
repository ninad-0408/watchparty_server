import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

import userModel from '../models/userModel.js'
import { dataUnaccesable, serverError, wrongPassword } from '../alerts/errors.js';

export const userLogin = (req, res) => {

    const { username, password } = req.body;

    // check for user exsistance and token sign
    userModel.findOne({ username: username })
        .then((data) => {
            if(data)
            {
                bcrypt.compare(password, data.password)
                    .then((check) => {
                        if(check)
                        {
                            const token = jwt.sign({ email: data.email, _id: data._id, username: data.username }, process.env.hashtoken);
                            return res.status(200).json({ user: { name: data.name, email: data.email, _id: data._id, username: data.username }, token, message: "You are logged in successfully." });
                        }
                        else
                        return wrongPassword(res);
                    })
                    .catch((error) => {
                        console.log(error);
                        return serverError(res);
                    });                
                
            }
            else
            {
                let err = new Error();
                err.message = "Username does not exsist.";
                err.status = 403;
                return res.status(err.status).json({ err });
            }
        })
        .catch((error) => {
            console.log(error);
            return dataUnaccesable(res);
        });
    
};

export const userSignup = async (req, res) => {
    
    const { name, email, username, password, confirmPassword } = req.body;

    // check duplicate username
    await userModel.findOne({ username: username })
        .then((data) => {            
            if(data)
            {
                let err = new Error();
                err.message = "Username already exsist choose another one.";
                err.status = 403;
                return res.status(err.status).json({ err });
            }
        })
        .catch((err) => {
            console.log(err);
            return dataUnaccesable(res);
        });

    
    // check duplicate email
    await userModel.findOne({ email: email })
        .then((data) => {   
            if(data)
            {
                let err = new Error();
                err.message = "Email already registed with us.";
                err.status = 403;
                return res.status(err.status).json({ err });
            }
        })
        .catch((err) => {
            console.log(err);
            return dataUnaccesable(res);
        });
    
    // check for password match
    if(password !== confirmPassword)
    {
        let err = new Error();
        err.message = "Password and Confirm Password don't match."
        err.status = 403;
        return res.status(err.status).json({ err });
    }


    // hashing password and creating user
    await bcrypt.hash(password, 4)
        .then((hash) => {
            userModel.create({ name, email, username, password: hash })
                .then((data) => {
                    console.log(data);
                    const token = jwt.sign({ email: data.email, _id: data._id, username: data.username }, process.env.hashtoken);
                    return res.status(200).json({ user: { name: data.name, email: data.email, _id: data._id, username: data.username }, token, message: "You are signuped successfully." });
                })
                .catch((error) => {
                    console.log(error);
                    return dataUnaccesable(res);
                });
        })
        .catch((error) => {
            console.log(error);
            return serverError(res);
        });    

};

export const getUsers = (req, res) => {

    userModel.find({}, ['username', '_id'])
        .then((data) => {
            return res.status(200).json({ users: data });
        })
        .catch((error) => {
            console.log(error);
            return dataUnaccesable(res);
        })
}