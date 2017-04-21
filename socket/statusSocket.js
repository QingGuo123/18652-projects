"use strict";

module.exports = function(socket, io) {
    socket.on("status", function(obj){
        io.sockets.emit("updateDirectory");
    });
};
