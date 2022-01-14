import { addUser, removeUser, getUser, getUsersInRoom } from "./logic.js";

const handleSocket = (io, socket) => {

    socket.on('new-member', (room) => {
        // console.log(room);
        const  user  = addUser({  _id: socket.user._id, username: socket.user.username, isAdmin: false, isHost: false ,room });
        socket.join(user.room);
        const users=getUsersInRoom(user.room);
        io.to(user.room).emit('member-connected', users );
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
            // io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            // io.to(user.room).emit('member-connected', {  users: getUsersInRoom(user.room)});
            const users=getUsersInRoom(user.room);
            io.to(user.room).emit('member-connected', users);
          }
        // io.emit('member-connected', users);
        
    })

};

export default handleSocket;