"use strict";

var db = require("../db/db.js");
var sql_user = require("../db/sql_user");
var sql_message = require("../db/sql_message");
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var model_log = config.console_log_config.model_log;

var Message = function(username, content, timestamp, location) {
    this.username = username;
    this.content = content;
    this.timestamp = timestamp;
    this.location = location;
};

Message.prototype.postPublicMessage = function(callback) {
    var username = this.username;
    var content = this.content;
    var timestamp = this.timestamp;
    var location = this.location;
    if (model_log)
        console.log('~/models/message: postPublicMessage ' + username + ' ' + content + ' ' + timestamp + ' ' + location);
    db.serialize(function () {
        db.all(sql_user.getUser(), [username],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    callback(null, new AppErrors.UserNotExisted("User not existed."));
                } else if (rows.length == 1) {
                    db.run(sql_message.insertMessage(), [username, content, timestamp, location, username],
                        function (error) {
                            if (error) {
                                callback(null, error);
                            } else {
                                callback({"postPublicMessageResult": 0}, null);
                            }
                        }
                    );
                } else if (rows.length > 1) {
                    callback(null, new AppErrors.RepeatedUsername("This username has over than 1 query results."));
                }
            }
        );
    });
};

Message.getAllPublicMessages = function(callback) {
    if (model_log)
        console.log('~/models/message: getAllPublicMessages');
    var messages = [];
    db.each(sql_message.getAllPublicMessages(),
        function (error, row) {
            if (error) {
                callback(null, error);
            } else if (row) {
                messages.push(row);
            }
        }, function () {
            callback(messages, null);
        }
    );
};

Message.getPublicMessage = function(callback, userdata) {
    var username = userdata["username"];
    if (model_log)
        console.log('~/models/message: getPublicMessage ' + username);
    db.serialize(function () {
        db.all(sql_user.getUser(), [username],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    callback(null, new AppErrors.UserNotExisted("User not existed."));
                } else if (rows.length == 1)  {
                    var messages = [];
                    db.each(sql_message.getPublicMessage(), [username],
                        function (error, row) {
                            if (error) {
                                callback(null, error);
                            } else if (row) {
                                messages.push(row);
                            }
                        }, function () {
                            callback(messages, null);
                        }
                    );
                } else if (rows.length > 1) {
                    callback(null, new AppErrors.RepeatedUsername("This username has over than 1 query results."));
                }
            }
        );
    });
};

module.exports = Message;
