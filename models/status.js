"use strict";

var db = require("../db/db.js");
var sql_user = require("../db/sql_user");
var sql_status = require("../db/sql_status");
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var model_log = config.console_log_config.model_log;

var Status = function(username, status_code, timestamp, location) {
    this.username = username;
    this.status_code = status_code;
    this.timestamp = timestamp;
    this.location = location;
};

Status.prototype.postStatus = function(callback) {
    var username = this.username;
    var status_code = this.status_code;
    var timestamp = this.timestamp;
    var location = this.location;
    if (model_log)
        console.log('~/models/status: postStatus ' + username + ' ' + status_code + ' ' + timestamp + ' ' + location);
    db.serialize(function () {
        db.all(sql_user.getUser(), [username],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    callback(null, new AppErrors.UserNotExisted("User not existed."));
                } else if (rows.length == 1) {
                    db.all(sql_status.getStatus(), [username],
                        function (error, status) {
                            console.log(status);
                            if (error) {
                                callback(null, error);
                            }
                            if (status.length == 0) {
                                db.run(sql_status.insertStatus(), [username, status_code, timestamp, location],
                                    function(error) {
                                        if (error) {
                                            callback(null, error);
                                        } else {
                                            callback({"postStatusResult": 0}, null);
                                        }
                                    }
                                );
                            }
                            else if (status.length == 1) {
                                db.run(sql_status.updateStatus(), [status_code, timestamp, location, username],
                                    function(error) {
                                        if (error) {
                                            callback(null, error);
                                        } else {
                                            callback({"postStatusResult": 0}, null);
                                        }
                                    }
                                );
                            }
                            else {
                                callback(null, new AppErrors.RepeatedStatus("The status of this username has over than 1 query results."));
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

Status.getStatus = function(callback, userdata) {
    var username = userdata["username"];
    if (model_log)
        console.log('~/models/status: getStatus ' + username);
    db.serialize(function () {
        db.all(sql_user.getUser(), [username],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    callback(null, new AppErrors.UserNotExisted("User not existed."));
                } else if (rows.length == 1)  {
                    db.all(sql_status.getStatus(), [username],
                        function (error, status) {
                            if (error) {
                                callback(null, error);
                            } else {
                                callback(status[0], null);
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

module.exports = Status;
