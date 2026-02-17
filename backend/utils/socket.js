const { Server } = require('socket.io');

let io;
const userSockets = new Map(); // userId -> socketId

const getOnlineUsers = () => {
    return Array.from(userSockets.keys());
};

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        }
    });

    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);

        socket.on('setup', (userId) => {
            if (userId) {
                socket.join(userId);
                userSockets.set(String(userId), socket.id);
                console.log(`👤 User ${userId} connected and joined room`);

                // Broadcast updated online users list
                io.emit('get_online_users', getOnlineUsers());
                socket.emit('connected');
            }
        });

        socket.on('join_chat', (room) => {
            socket.join(room);
            console.log('📁 User joined room:', room);
        });

        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
            // Cleanup userSockets map
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    // Broadcast updated online users list after disconnect
                    io.emit('get_online_users', getOnlineUsers());
                    break;
                }
            }
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

const emitToUser = (userId, event, data) => {
    if (io) {
        io.to(userId).emit(event, data);
    }
};

module.exports = { initSocket, getIO, emitToUser };
