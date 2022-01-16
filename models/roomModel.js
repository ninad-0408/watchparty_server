import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({

    name: String,
    host: {
        type: mongoose.Types.ObjectId,
        ref: 'userModel'
    },
    open: {
        type: Boolean,
        default: true
    },
    password: String,
    isPassword: {
        type: Boolean,
        default: false
    },
    allowedUsers:{
        type:[{
                type: mongoose.Types.ObjectId,
                ref: 'userModel'
             }],
        default: []
    },
    videoLink: String

});

const roomModel = mongoose.model('roomModel', roomSchema);

export default roomModel;