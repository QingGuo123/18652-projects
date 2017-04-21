"use strict";

var Message = require('../models/message');
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var controller_log = config.console_log_config.controller_log;
var response_log = config.console_log_config.response_log;
var session_log = config.console_log_config.session_log;
var check_session = config.test_config.check_session;

module.exports = {

    getAllPublicMessages: function(req, res) {
        if (controller_log)
            console.log('~/controllers/messagesController: getAllPublicMessages');
        Message.getAllPublicMessages(function(allmessages, error) {
            if (error)
                res.sendStatus(500);
            else {
                var outputjson = {"messages": allmessages};
                if (response_log)
                    console.log(outputjson);
                res.status(200).send(outputjson);
            }
        });
    },

    getPublicMessage: function(req, res) {
        var username = req.params.username;
        if (controller_log)
            console.log('~/controllers/messagesController: getPublicMessage ' + username);
        Message.getPublicMessage(
            function (messages, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                } else {
                    var outputjson = {"messages": messages};
                    if (response_log)
                        console.log(outputjson);
                    res.status(200).send(outputjson);
                }
            },
            {"username": username}
        );
    },

    postPublicMessage: function(req, res) {
        var username = req.body.username;
        var content = req.body.content;
        var timestamp = req.body.timestamp;
        var location = req.body.location;
        if (controller_log)
            console.log('~/controllers/messagesController: postPublicMessage ' + username + ' ' + content + ' ' + timestamp + ' ' + location);
        if (check_session && req.session.loginUser != username) {
            if (session_log)
                console.log('session: ' + req.session.loginUser + ', username: ' + username);
            res.sendStatus(404);
        }
        else {
            var message = new Message(username, content, timestamp, location);
            message.postPublicMessage(function(postPublicMessageResult, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                }
                else {
                    if (response_log)
                        console.log(postPublicMessageResult);
                    res.status(200).send(postPublicMessageResult);
                }
            });
        }
    }

};
