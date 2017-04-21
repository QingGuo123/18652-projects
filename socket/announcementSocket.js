"use strict";

module.exports = function(socket, io) {
    socket.on("announcement", function(obj){
        io.sockets.emit("announcement", {
            "username": obj.username,
            "content": obj.content,
            "timestamp": obj.timestamp,
            "location": obj.location
        });
    });
};
