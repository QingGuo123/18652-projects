"use strict";

var Notification = require('../models/notification');
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var controller_log = config.console_log_config.controller_log;
var response_log = config.console_log_config.response_log;
var session_log = config.console_log_config.session_log;
var check_session = config.test_config.check_session;

module.exports = {

    getNotifications: function(req, res) {
        var username = req.params.username;
        if (controller_log)
            console.log('~/controllers/messagesController: getPublicMessage ' + username);
        Notification.getNotifications(
            function (notifications, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                } else {
                    var outputjson = {"notifications": notifications};
                    if (response_log)
                        console.log(outputjson);
                    res.status(200).send(outputjson);
                }
            },
            {"username": username}
        );
    },

    postNotification: function(req, res) {
        var username = req.body.username;
        var content = req.body.content;
        var timestamp = req.body.timestamp;
        var type = req.body.type;
        if (controller_log)
            console.log('~/controllers/notifyController: postNotification ' + username + ' ' + content + ' ' + timestamp + ' ' + type);
        if (check_session && req.session.loginUser != username) {
            if (session_log)
                console.log('session: ' + req.session.loginUser + ', username: ' + username);
            res.sendStatus(404);
        }
        else {
            var notification = new Notification(username, content, timestamp, type);
            notification.postNotification(function(postNotificationResult, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                }
                else {
                    if (response_log)
                        console.log(postNotificationResult);
                    res.status(200).send(postNotificationResult);
                }
            });
        }
    }

};
