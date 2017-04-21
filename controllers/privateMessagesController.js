"use strict";

var PrivateMessage = require('../models/privateMessage');
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var controller_log = config.console_log_config.controller_log;
var response_log = config.console_log_config.response_log;
var session_log = config.console_log_config.session_log;
var check_session = config.test_config.check_session;

module.exports = {

    getPrivateMessage: function(req, res) {
        var sender = req.params.sender;
        var receiver = req.params.receiver;
        if (controller_log)
            console.log('~/controllers/privateMessagesController: getPrivateMessage ' + sender + ' ' + receiver);
        PrivateMessage.getPrivateMessage(
            function (privateMessages, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                } else {
                    var outputjson = {"privateMessages": privateMessages};
                    if (response_log)
                        console.log(outputjson);
                    res.status(200).send(outputjson);
                }
            },
            {"sender": sender, "receiver": receiver}
        );
    },

    postPrivateMessage: function(req, res) {
        var sender = req.body.sender;
        var receiver = req.body.receiver;
        var content = req.body.content;
        var timestamp = req.body.timestamp;
        var location = req.body.location;
        if (controller_log)
            console.log('~/controllers/privateMessagesController: postPrivateMessage ' + sender + ' ' + receiver + ' ' + content + ' ' + timestamp + ' ' + location);
        if (check_session && req.session.loginUser != sender) {
            if (session_log)
                console.log('session: ' + req.session.loginUser + ', sender: ' + sender);
            res.sendStatus(404);
        }
        else {
            var privateMessage = new PrivateMessage(sender, receiver, content, timestamp, location);
            privateMessage.postPrivateMessage(function(postPrivateMessageResult, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                }
                else {
                    if (response_log)
                        console.log(postPrivateMessageResult);
                    res.status(200).send(postPrivateMessageResult);
                }
            });
        }
    },

    resetUnreadMessages: function(req, res) {
        var sender = req.body.sender;
        var receiver = req.body.receiver;
        if (controller_log)
            console.log('~/controllers/privateMessagesController: resetUnreadMessages ' + sender + ' ' + receiver);
        if (check_session && req.session.loginUser != receiver) {
            if (session_log)
                console.log('session: ' + req.session.loginUser + ', receiver: ' + receiver);
            res.sendStatus(404);
        }
        else {
            PrivateMessage.resetUnreadMessages(
                function (resetUnreadMessagesResult, error) {
                    if (error) {
                        if (error instanceof AppErrors.UserNotExisted)
                            res.sendStatus(404);
                        else
                            res.sendStatus(500);
                    } else {
                        if (response_log)
                            console.log(resetUnreadMessagesResult);
                        res.status(200).send(resetUnreadMessagesResult);
                    }
                },
                {"sender": sender, "receiver": receiver}
            );
        }
    }

};
