import { addUser, removeUser, getUser, getUsersInRoom } from "./logic.js";
import roomModel from "../models/roomModel.js";

const handleSocket = (io, socket) => {

    socket.on('new-member', (room) => {
        roomModel.findById(room)
            .then(async (data) => {
                var isHost = false;
                var isAdmin = false;

                if(data.host === socket.user._id)
                {
                    isHost = true;
                    isAdmin = true;
                }
                else
                {
                    if(data.admins.indexOf(socket.user._id)!==-1)
                    isAdmin = true;
                }
                const user = await addUser({  _id: socket.user._id, username: socket.user.username, isAdmin, isHost, room });
                socket.join(user.room);
                const users = getUsersInRoom(user.room);
                io.to(user.room).emit('member-connected', users );
            })
            .catch((error) => {
                console.log(error);
                socket.to(socket.id).emit('error', { error });
            });
        
    });

    socket.on('message', ({value,roomId}) => {
        // console.log(roomId);
        const message=value;
        const user=getUser(socket.user.username,roomId);
        // console.log(user);
        socket.to(user.room).emit('message', { username: socket.user.username, message: message})
    });

    socket.on('url', ({roomId,url}) => {
        // console.log(url);
        // console.log(roomId);
        socket.to(roomId).emit('url', url);
    });

    socket.on('seek', (data) => {
        // console.log(data);
        socket.to(data.roomId).emit('seek', data)
    });

    socket.on('disconnect', () => {
        console.log("discoonected");
        const user = removeUser(socket.user._id);
        if(user) {
            console.log('here2');
            const users=getUsersInRoom(user.room);
            io.to(user.room).emit('member-connected', users);
          }
        // io.emit('member-connected', users);
        
    })

};

export default handleSocket;