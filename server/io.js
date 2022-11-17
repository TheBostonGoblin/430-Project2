const http = require('http');
const { Server } = require('socket.io');

let io = null;

const warp = middleware => (socket,next) => middleware(socket.request,{},next);
const socketSetup = (app,sessionMiddleware) =>{

    const server = http.createServer(app);
    io = new Server(server);

    io.use(warp(sessionMiddleware));
    console.log("socket setup triggered");

    io.on('connection', (socket) => {
        console.log(`${socket.request.session.account.username} has connected to the server`);
        
        socket.on('disconnect', () =>{
            console.log(`${socket.request.session.account.username} has disconnected from the server`);
        })

    });

    io.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

    return server;
}

module.exports = socketSetup;