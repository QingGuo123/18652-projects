"use strict";

var db = require("../db/db.js");
var sql_user = require("../db/sql_user");
var sql_status = require("../db/sql_status");
var sql_privateMessage = require("../db/sql_privateMessage");
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var model_log = config.console_log_config.model_log;

var User = function(username, password) {
    this.username = username;
    this.password = password;
};

User.prototype.regOrLogin = function(callback) {
    var username = this.username;
    var password = this.password;
    if (model_log)
        console.log('~/models/user: regOrLogin ' + username + ' ' + password);
    db.serialize(function () {
        db.all(sql_user.getUser(), [username],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    db.run(sql_user.insertUser(), [username, password],
                        function (error) {
                            if (error) {
                                callback(null, error);
                            } else {
                                db.run(sql_status.insertStatus(), [username, -1, '', ''],
                                    function(error) {
                                        if (error) {
                                            callback(null, error);
                                        } else {
                                            callback({"regOrLoginResult": 0}, null);
                                        }
                                    }
                                );
                            }
                        }
                    );
                } else if (rows.length == 1) {
                    db.all(sql_user.validUsernameAndPassword(), [username, password],
                        function (error, rows) {
                            if (error)
                                callback(null, error);
                            else if (rows.length == 0) {
                                callback({"regOrLoginResult": 1}, null);
                            }
                            else if (rows.length == 1) {
                                callback({"regOrLoginResult": 2}, null);
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

User.getAllUsers = function(callback, userdata) {
    if (model_log)
        console.log('~/models/user: getAllusers');
    var username = userdata["username"];
    var users = [];
    db.each(sql_user.getAllUsers(),
        function (error, row) {
            if (error) {
                callback(null, error);
            } else if (row) {
                users.push({
                    "username": row.username,
                    "onlinestatus": row.onlinestatus,
                    "accountstatus": row.accountstatus,
                    "privilege": row.privilege,
                    "status": {
                        "status_code": row.status_code,
                        "timestamp": row.timestamp,
                        "location": row.location
                    },
                    "newpms": 0
                });
            }
        }, function () {
            db.each(sql_privateMessage.getNewPMNumByReceiver(), [username], function(error, row) {
                if (error) {
                    callback(null, error);
                }
                else if (row) {
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].username == row.sender) {
                            users[i].newpms = row.newpms;
                            break;
                        }
                    }
                }
            }, function () {
                callback(users, null);
            });
        }
    );
};

User.getUser = function(callback, userdata) {
    var username = userdata["username"];
    if (model_log)
        console.log('~/models/user: getUser ' + username);
    db.all(sql_user.getUser(), [username],
        function (error, rows) {
            if (error) {
                callback(null, error);
            } else if (rows.length == 0) {
                callback(null, new AppErrors.UserNotExisted("User not existed."));
            } else if (rows.length == 1){
                callback(rows[0], null);
            } else if (rows.length > 1) {
                callback(null, new AppErrors.RepeatedUsername("This username has over than 1 query results."));
            }
        }
    );
};

module.exports = User;
