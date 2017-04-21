"use strict";

var db = require("../db/db.js");
var sql_user = require("../db/sql_user");
var sql_privateMessage = require("../db/sql_privateMessage");
var AppErrors = require("../AppErrors");
var config = require('../config/global.js');

var model_log = config.console_log_config.model_log;

var PrivateMessage = function(sender, receiver, content, timestamp, location) {
    this.sender = sender;
    this.receiver = receiver;
    this.content = content;
    this.timestamp = timestamp;
    this.location = location;
};

PrivateMessage.prototype.postPrivateMessage = function(callback) {
    var sender = this.sender;
    var receiver = this.receiver;
    var content = this.content;
    var timestamp = this.timestamp;
    var location = this.location;
    if (model_log)
        console.log('~/models/privateMessage: postPrivateMessage ' + sender + ' ' + receiver + ' ' + content + ' ' + timestamp + ' ' + location);
    db.serialize(function () {
        db.all(sql_user.getUser(), [sender],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    callback(null, new AppErrors.UserNotExisted("Sender not existed."));
                } else if (rows.length == 1) {
                    db.all(sql_user.getUser(), [receiver],
                        function (error, rows) {
                            if (error) {
                                callback(null, error);
                            } else if (rows.length == 0) {
                                callback(null, new AppErrors.UserNotExisted("Receiver not existed."));
                            } else if (rows.length == 1) {
                                db.run(sql_privateMessage.insertPrivateMessage(), [sender, receiver, content, timestamp, location, sender],
                                    function (error) {
                                        if (error) {
                                            callback(null, error);
                                        } else {
                                            callback({"postPrivateMessageResult": 0}, null);
                                        }
                                    }
                                );
                            } else if (rows.length > 1) {
                                callback(null, new AppErrors.RepeatedUsername("This receiver has over than 1 query results."));
                            }
                        }
                    );
                } else if (rows.length > 1) {
                    callback(null, new AppErrors.RepeatedUsername("This sender has over than 1 query results."));
                }
            }
        );
    });
};

PrivateMessage.resetUnreadMessages = function(callback, userdata) {
    var sender = userdata.sender;
    var receiver = userdata.receiver;
    if (model_log)
        console.log('~/models/privateMessage: resetUnreadMessages ' + sender + ' ' + receiver);
    db.serialize(function () {
        db.run(sql_privateMessage.resetUnreadMessages(), [sender, receiver],
            function (error) {
                if (error) {
                    callback(null, error);
                } else {
                    callback({"resetUnreadMessagesResult": 0}, null);
                }
            }
        );
    });
};

PrivateMessage.getPrivateMessage = function(callback, userdata) {
    var sender = userdata.sender;
    var receiver = userdata.receiver;
    if (model_log)
        console.log('~/models/privateMessage: getPrivateMessage ' + sender + ' ' + receiver);
    db.serialize(function () {
        db.all(sql_user.getUser(), [sender],
            function (error, rows) {
                if (error) {
                    callback(null, error);
                } else if (rows.length == 0) {
                    callback(null, new AppErrors.UserNotExisted("Sender not existed."));
                } else if (rows.length == 1)  {
                    db.all(sql_user.getUser(), [receiver],
                        function (error, rows) {
                            if (error) {
                                callback(null, error);
                            } else if (rows.length == 0) {
                                callback(null, new AppErrors.UserNotExisted("Receiver not existed."));
                            } else if (rows.length == 1)  {
                                var privateMessages = [];
                                db.each(sql_privateMessage.getPrivateMessageBySenderAndReceiver(), [sender, receiver, sender, receiver],
                                    function (error, row) {
                                        if (error) {
                                            callback(null, error);
                                        } else if (row) {
                                            privateMessages.push(row);
                                        }
                                    }, function () {
                                        callback(privateMessages, null);
                                    }
                                );
                            } else if (rows.length > 1) {
                                callback(null, new AppErrors.RepeatedUsername("This receiver has over than 1 query results."));
                            }
                        }
                    );
                } else if (rows.length > 1) {
                    callback(null, new AppErrors.RepeatedUsername("This sender has over than 1 query results."));
                }
            }
        );
    });
};

module.exports = PrivateMessage;
