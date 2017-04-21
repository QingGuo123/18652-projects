"use strict";

var User = require('../models/user');
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var controller_log = config.console_log_config.controller_log;
var response_log = config.console_log_config.response_log;

module.exports = {

    getAllUsers: function(req, res) {
        var username = req.session.loginUser;
        if (controller_log)
            console.log('~/controllers/usersController: getAllusers');
        User.getAllUsers(function (users, error) {
            if (error) {
                res.sendStatus(500);
            } else {
                var outputjson = {"users": users};
                if (response_log)
                    console.log(outputjson);
                res.status(200).send(outputjson);
            }
        }, {"username": username});
    },

    getUser: function(req, res) {
        var username = req.params.username;
        if (controller_log)
            console.log('~/controllers/usersController: getUser ' + username);
        User.getUser(
            function (user, error) {
                if (error) {
                    if (error instanceof AppErrors.UserNotExisted)
                        res.sendStatus(404);
                    else
                        res.sendStatus(500);
                } else {
                    if (response_log)
                        console.log(user);
                    res.status(200).send(user);
                }
            },
            {"username": username}
        );
    },

    /**
     * regOrLoginResult
     *      0: register succeed
     *      1: user existed, password wrong
     *      2: login succeed
    */
    regOrLogin: function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        if (controller_log)
            console.log('~/controllers/usersController: regOrLogin ' + username + ' ' + password);
        var user = new User(username, password);
        user.regOrLogin(
            function (regOrLoginResult, error) {
                if(error) {
                    res.sendStatus(500);
                } else {
                    if (response_log)
                        console.log(regOrLoginResult);
                    if (regOrLoginResult.regOrLoginResult == 0 || regOrLoginResult.regOrLoginResult == 2) {
                        req.session.regenerate(function(err) {
                            if(err)
                                res.sendStatus(500);
                            req.session.loginUser = username;
                            var statusCode = 0;
                            if (regOrLoginResult.regOrLoginResult == 0)
                                statusCode = 201;
                            else
                                statusCode = 200;
                            res.status(statusCode).send(regOrLoginResult);
                        });
                    }
                    else if (regOrLoginResult.regOrLoginResult == 1)
                        res.status(200).send(regOrLoginResult);
                }
            }
        );
    }

};
