"use strict";

var path = require('path');

var db_config = {
    "ESN_db": {
        "driver": "sqlite3",
        "path": path.join(__dirname, '../db/ESN_db.db')
    },
    "test_db": {
        "driver": "sqlite3",
        "path": path.join(__dirname, '../db/test_db.db')
    }
};

var console_log_config = {
    "controller_log": true,
    "model_log": true,
    "response_log": true,
    "session_log": true
};

var test_config = {
    "is_test": true,
    "check_session": false,
    "delete_db_when_run": true
};

module.exports = {
    "db_config": db_config,
    "console_log_config": console_log_config,
    "test_config": test_config
}
