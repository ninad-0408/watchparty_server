import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import sendMessage from "../mails/mail.js";
import userModel from "../models/userModel.js";
import {
  dataUnaccesable,
  serverError,
  wrongPassword,
} from "../alerts/errors.js";

export const userLogin = (req, res) => {
  const { username, password } = req.body;

  // check for user exsistance and token sign
  userModel
    .findOne({ username: username })
    .then((data) => {
      if (data) {
        bcrypt
          .compare(password, data.password)
          .then((check) => {
            if (check) {
              const token = jwt.sign(
                { email: data.email, _id: data._id, username: data.username },
                process.env.hashtoken
              );

              return res.status(200).json({
                token,
                username: data.username,
                _id: data._id,
                message: "You are logged in successfully.",
              });
            } else return wrongPassword(res);
          })
          .catch((error) => {
            console.log(error);
            return serverError(res);
          });
      } else {
        let err = new Error();
        err.message = "Username does not exist.";
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
  await userModel
    .findOne({ username: username })
    .then((data) => {
      if (data) {
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
  await userModel
    .findOne({ email: email })
    .then((data) => {
      if (data) {
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
  if (password !== confirmPassword) {
    let err = new Error();
    err.message = "Password and Confirm Password don't match.";
    err.status = 403;
    return res.status(err.status).json({ err });
  }

  // hashing password and creating user
  await bcrypt
    .hash(password, 4)
    .then((hash) => {
      userModel
        .create({ name, email, username, password: hash })
        .then((data) => {
          const token = jwt.sign(
            { email: data.email, _id: data._id, username: data.username },
            process.env.hashtoken
          );

          return res.status(200).json({
            token,
            username: data.username,
            _id: data._id,
            message: "You are signuped successfully.",
          });
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
  userModel
    .find({}, ["username", "_id"])
    .then((data) => {
      return res.status(200).json({ users: data });
    })
    .catch((error) => {
      console.log(error);
      return dataUnaccesable(res);
    });
};

export const forgetpassword = async (req, res) => {
  const { username, email } = req.body;
  try {
    await userModel
      .findOne({ email: email, username: username })
      .then((user) => {
        if (!user) {
          let err = new Error();
          err.message = "User not found with this Email";
          err.status = 404;
          return res.status(err.status).json({ err });
        } else {
          const token = jwt.sign(
            { _id: user._id, resetpassword: true },
            process.env.hashtoken
          );

          const reset_link = `https://watch-party-project.web.app/resetpassword/${token}`;
          var mailOptions = {
            from: {
              name: "WatchParty: Password Recovery",
              address: process.env.EMAIL,
            },
            to: user.email,
            subject: `Reset Password`,
            text: `Your reset password link is ${reset_link}`,
          };
          const test = async () => {
            await sendMessage(mailOptions);
          };
          test();
          return res.status(200).json({
            message: "Link is Active for 10 mins",
          });
        }
      });
  } catch (error) {
    return dataUnaccesable(res);
  }
};

export const resetpassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  const user = jwt.verify(token, process.env.hashtoken);
  // console.log(user);
  if (password !== confirmPassword) {
    let err = new Error();
    err.message = "Password and Confirm Password don't match.";
    err.status = 403;
    return res.status(err.status).json({ err });
  }
  var current_time = Date.now().valueOf() / 1000;
  // console.log(current_time);
  if ((current_time - user.iat) / 60 > 10) {
    let err = new Error();
    err.message = "Token has expired ";
    err.status = 401;
    return res.status(err.status).json({ err });
  }
  try {
    await bcrypt.hash(password, 4).then(async (hash) => {
      await userModel.findByIdAndUpdate({ _id: user._id }, { password: hash });
    });

    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    return dataUnaccesable(res);
  }
};

export const changePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, password, confirmPassword } = req.body;
  if (currentPassword == password) {
    let err = new Error();
    err.message = "Enter a new password";
    err.status = 403;
    return res.status(err.status).json({ err });
  }
  if (password !== confirmPassword) {
    let err = new Error();
    err.message = "Password and Confirm Password don't match.";
    err.status = 403;
    return res.status(err.status).json({ err });
  }
  try {
    await bcrypt.hash(password, 4).then(async (hash) => {
      await userModel.findByIdAndUpdate({ _id: userId }, { password: hash });
    });

    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    return dataUnaccesable(res);
  }
};
