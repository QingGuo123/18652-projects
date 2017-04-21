"use strict";

module.exports = function(socket, io, usocket) {
    
    socket.on("message", function(obj){
        io.sockets.emit("message", {
            "username": obj.username,
            "content": obj.content,
            "timestamp": obj.timestamp,
            "location": obj.location,
            "status_code": obj.status_code
        });
    });

    socket.on("startChatPrivately", function(obj){
        if (obj.username in usocket) {}
        else {
            socket.username = obj.username;
            usocket[obj.username] = socket;
            usocket.length++;
        }
    });

    socket.on("privateMessage", function(obj){
        if (obj.from in usocket) {
            usocket[obj.from].emit("ev_to" + obj.from, obj);
        }
        if (obj.to in usocket) {
            usocket[obj.to].emit("ev_to" + obj.to, obj);
        }
    });
};
