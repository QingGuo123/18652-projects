"use strict";

var db = require("../db/db.js");
var sql_user = require("../db/sql_user");

module.exports = function(socket, io) {

    socket.on("userLogin", function(obj){
        console.log('id: ' + socket.id);
        db.run(sql_user.updateUserOnline(), [obj.username],
            function (error) {
                if (error) {
                    io.sockets.emit("error");
                } else {
                    io.sockets.emit("updateDirectory");
                }
            }
        );
    });

    socket.on("userLogout", function(obj){
        //console.log('id: ' + socket.id);
        console.log(obj.username + ' logout.');
        db.run(sql_user.updateUserOffline(), [obj.username],
            function (error) {
                if (error) {
                    io.sockets.emit("error");
                } else {
                    io.sockets.emit("updateDirectory");
                }
            }
        );
    });

    // socket.on("disconnect", function(obj){
    //     console.log('id: ' + socket.id);
    //     console.log(obj.username + ' disconnect.');
    //     db.run(sql_user.updateUserOffline(), [obj.username],
    //         function (error) {
    //             if (error) {
    //                 io.sockets.emit("error");
    //             } else {
    //                 io.sockets.emit("updateDirectory");
    //             }
    //         }
    //     );
    // });
};
