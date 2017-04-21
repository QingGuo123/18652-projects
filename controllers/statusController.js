"use strict";

var Status = require('../models/status');
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var controller_log = config.console_log_config.controller_log;
var response_log = config.console_log_config.response_log;
var session_log = config.console_log_config.session_log;
var check_session = config.test_config.check_session;

module.exports = {

    getStatus: function(req, res) {
        var username = req.params.username;
        if (controller_log)
            console.log('~/controllers/statusController: getStatus ' + username);
        Status.getStatus(
            function (status, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                } else {
                    var outputjson = {"status": status};
                    if (response_log)
                        console.log(outputjson);
                    res.status(200).send(outputjson);
                }
            },
            {"username": username}
        );
    },

    postStatus: function(req, res) {
        var username = req.body.username;
        var status_code = req.body.status_code;
        var timestamp = req.body.timestamp;
        var location = req.body.location;
        if (controller_log)
            console.log('~/controllers/statusController: postStatus ' + username + ' ' + status_code + ' ' + timestamp + ' ' + location);
        if (check_session && req.session.loginUser != username) {
            if (session_log)
                console.log('session: ' + req.session.loginUser + ', username: ' + username);
            res.sendStatus(404);
        }
        else {
            var status = new Status(username, status_code, timestamp, location);
            status.postStatus(function(postStatusResult, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                }
                else {
                    if (response_log)
                        console.log(postStatusResult);
                    res.status(200).send(postStatusResult);
                }
            });
        }
    }

};
