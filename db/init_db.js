"use strict";

var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var config = require('../config/global.js');

var sql_user = require('../db/sql_user');
var sql_message = require('../db/sql_message');
var sql_announcement = require('../db/sql_announcement');
var sql_status = require('../db/sql_status');
var sql_privateMessage = require('../db/sql_privateMessage');
var sql_notification = require('../db/sql_notification');

var delete_db_when_run = config.test_config.delete_db_when_run;

module.exports = {

    initDB: function(db_path) {
        console.log("initialize database " + db_path);
        var db = new sqlite3.Database(db_path);
        var exists = fs.existsSync(db_path);
        if (exists && delete_db_when_run) {
            fs.unlinkSync(db_path);
            console.log("delete database succeed");
            db = new sqlite3.Database(db_path);
            db = createDBAndTables(db, function(){});
        }
        else if (!exists) {
            db = new sqlite3.Database(db_path);
            db = createDBAndTables(db, function(){});
        }
        return db;
    },

    resetTestDB: function(callback) {
        if (config.test_config.is_test) {
            var db = new sqlite3.Database(config.db_config.test_db.path);
            db.serialize(function() {
                db.run(sql_privateMessage.dropTable());
                db.run(sql_status.dropTable());
                db.run(sql_announcement.dropTable());
                db.run(sql_notification.dropTable());
                db.run(sql_message.dropTable());
                db.run(sql_user.dropTable());
                createDBAndTables(db, callback);
                console.log("reset test database succeed");
            });
        }
    }

};

function createDBAndTables(db, callback) {
    db.serialize(function() {
        db.run(sql_user.createTable());
        db.run(sql_message.createTable());
        db.run(sql_notification.createTable());
        db.run(sql_announcement.createTable());
        db.run(sql_status.createTable());
        db.run(sql_privateMessage.createTable(), callback);
    });
    console.log("create database & tables succeed");
    return db;
}
