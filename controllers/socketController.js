import { addUser, removeUser, getUser, getUsersInRoom } from "./logic.js";
import roomModel from "../models/roomModel.js";

const handleSocket = (io, socket) => {

    socket.on('new-member', (room) => {
        roomModel.findById(room)
            .then(async (data) => {
                var isHost = false;
                var isAdmin = false;

                if(data.host == socket.user._id)
                {
                    isHost = true;
                    isAdmin = true;
                }
                
                const user = await addUser({  _id: socket.user._id, socketId: socket.id, username: socket.user.username, isAdmin, isHost, room });
                socket.join(user.room);
                const users = getUsersInRoom(user.room);
                
    socket.emit('alert',`Welcome ${user.username}`);
                socket.broadcast.to(user.room).emit('alert', `${user.username} has joined!` );
                io.to(user.room).emit('member-connected', users );
            })
            .catch((error) => {
                console.log(error);
                socket.to(socket.id).emit('error', { error });
            });
        
    });

    socket.on('message', ({ value, roomId }) => {
        const message = value;
        const user = getUser(socket.user.username,roomId);
        socket.to(user.room).emit('message', { username: socket.user.username, message })
    });

    socket.on('url', ({ roomId, url }) => {
        socket.to(roomId).emit('url', url);
    });

    socket.on('seek', (data) => { 
        socket.to(data.roomId).emit('seek', data)
    });

    socket.on('disconnect', () => {
        console.log("disconnected");
        const user = removeUser(socket.user._id);
        if(user) {
            const users = getUsersInRoom(user.room);
            io.to(user.room).emit('alert', `${user.username} has left.` );
            io.to(user.room).emit('member-connected', users);
          }        
    });

    socket.on('add-admin', (user) => {
        roomModel.findById(user.room)
            .then(async (data) => {
                if(data.host == socket.user._id)
                {
                    await removeUser(user._id);
                    user.isAdmin = true;
                    user = await addUser(user);

                    const users = getUsersInRoom(user.room);
                    io.to(user.room).emit('member-connected', users);
                }
                else
                {
                    socket.to(socket.id).emit('error', { error: 'You are not host.'})
                }
            })
            .catch((error) => {
                console.log(error);
                socket.to(socket.id).emit('error', { error });
            });
    });

    socket.on('remove-admin', (user) => {
        roomModel.findById(user.room)
            .then(async (data) => {
                if(data.host == socket.user._id)
                {
                    await removeUser(user._id);
                    user.isAdmin = false;
                    user = await addUser(user);

                    const users = getUsersInRoom(user.room);
                    io.to(user.room).emit('member-connected', users);
                }
                else
                {
                    socket.to(socket.id).emit('error', { error: 'You are not host.'})
                }
            })
            .catch((error) => {
                console.log(error);
                socket.to(socket.id).emit('error', { error });
            });
    });

    socket.on('remove-member', (user) => {
        roomModel.findById(user.room)
            .then((data) => {
                if(data.host == socket.user._id)
                {
                    removeUser(user._id);
                    io.sockets.sockets.forEach((soc) => {
                        if(soc.id === user.socketId)
                        {
                            soc.disconnect();
                            const users = getUsersInRoom(user.room);
                            io.to(user.room).emit('member-connected', users);
                        }
                    });

                }
                else
                {
                    socket.to(socket.id).emit('error', { error: 'You are not host.'})
                }
            })
            .catch((error) => {
                console.log(error);
                socket.to(socket.id).emit('error', { error });
            });
    });

};

export default handleSocket;