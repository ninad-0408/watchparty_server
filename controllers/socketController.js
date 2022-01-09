var users = [];

const handleSocket = (io, socket) => {

    socket.on('new-member', (room) => {
        users.push({ _id: socket.user._id, username: socket.user.username, isAdmin: false, isHost: false });
        socket.emit('member-connected', users);
    });

    socket.on('message', (message) => {
        socket.broadcast.emit('message', { username: socket.user.username, message: message })
    });

    socket.on('disconnect', () => {
        users = users.filter((e) => e._id !== socket.user._id ? e : null);
        socket.emit('member-connected', users);
    })

};

export default handleSocket;