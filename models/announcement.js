"use strict";

var db = require("../db/db.js");
var sql_user = require("../db/sql_user");
var sql_announcement = require("../db/sql_announcement");
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var model_log = config.console_log_config.model_log;

var Announcement = function(username, content, timestamp, location) {
    this.username = username;
    this.content = content;
    this.timestamp = timestamp;
    this.location = location;
};

Announcement.prototype.postAnnouncement = function(callback) {
    var username = this.username;
    var content = this.content;
    var timestamp = this.timestamp;
    var location = this.location;
    if (model_log)
        console.log('~/models/announcement: postAnnouncement ' + username + ' ' + content + ' ' + timestamp + ' ' + location);
    db.serialize(function () {
        db.all(sql_user.getUser(), [username],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    callback(null, new AppErrors.UserNotExisted("User not existed."));
                } else if (rows.length == 1) {
                    db.run(sql_announcement.insertAnnouncement(), [username, content, timestamp, location],
                        function (error) {
                            if (error) {
                                callback(null, error);
                            } else {
                                callback({"postAnnouncementResult": 0}, null);
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

Announcement.getAllAnnouncements = function(callback) {
    if (model_log)
        console.log('~/models/announcement: getAllAnnouncements');
    var announcements = [];
    db.each(sql_announcement.getAllAnnouncements(),
        function (error, row) {
            if (error) {
                callback(null, error);
            } else if (row) {
                announcements.push(row);
            }
        }, function () {
            callback(announcements, null);
        }
    );
};

module.exports = Announcement;
