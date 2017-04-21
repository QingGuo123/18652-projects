"use strict";

var Announcement = require('../models/announcement');
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var controller_log = config.console_log_config.controller_log;
var response_log = config.console_log_config.response_log;
var session_log = config.console_log_config.session_log;
var check_session = config.test_config.check_session;

module.exports = {

    getAllAnnouncements: function(req, res) {
        if (controller_log)
            console.log('~/controllers/announcementsController: getAllAnnouncements');
        Announcement.getAllAnnouncements(function(allannouncements, error) {
            if (error)
                res.sendStatus(500);
            else {
                var outputjson = {"announcements": allannouncements};
                if (response_log)
                    console.log(outputjson);
                res.status(200).send(outputjson);
            }
        });
    },

    postAnnouncement: function(req, res) {
        var username = req.body.username;
        var content = req.body.content;
        var timestamp = req.body.timestamp;
        var location = req.body.location;
        if (controller_log)
            console.log('~/controllers/announcementsController: postAnnouncement ' + username + ' ' + content + ' ' + timestamp + ' ' + location);
        if (check_session && req.session.loginUser != username) {
            if (session_log)
                console.log('session: ' + req.session.loginUser + ', username: ' + username);
            res.sendStatus(404);
        }
        else {
            var announcement = new Announcement(username, content, timestamp, location);
            announcement.postAnnouncement(function(postAnnouncementResult, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                }
                else {
                    if (response_log)
                        console.log(postAnnouncementResult);
                    res.status(200).send(postAnnouncementResult);
                }
            });
        }
    }

};
