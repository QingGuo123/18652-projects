"use strict";

var db = require("../db/db.js");
var sql_user = require("../db/sql_user");
var sql_notification = require("../db/sql_notification");
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var model_log = config.console_log_config.model_log;

var Notification = function(username, content, timestamp, type) {
    this.username = username;
    this.content = content;
    this.timestamp = timestamp;
    this.type = type;
};

Notification.prototype.postNotification = function(callback) {
    var username = this.username;
    var content = this.content;
    var timestamp = this.timestamp;
    var type = this.type;
    if (model_log)
        console.log('~/models/notification: postNotification ' + username + ' ' + content + ' ' + timestamp + ' ' + type);
    db.serialize(function () {
        db.all(sql_user.getUser(), [username],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    callback(null, new AppErrors.UserNotExisted("User not existed."));
                } else if (rows.length == 1) {
                    db.run(sql_notification.insertnotification(), [username, content, timestamp, type],
                        function (error) {
                            if (error) {
                                callback(null, error);
                            } else {
                                callback({"postNotificationResult": 0}, null);
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

Notification.getNotifications = function(callback) {
    if (model_log)
        console.log('~/models/notification: getNotifications');
    var notifications = [];
    db.each(sql_notification.getNotifications(),
        function (error, row) {
            if (error) {
                callback(null, error);
            } else if (row) {
                notifications.push(row);
            }
        }, function () {
            callback(notifications, null);
        }
    );
};

module.exports = Notification;
