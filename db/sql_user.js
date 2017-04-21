"use strict";

module.exports = {

    /**
     * fields declaration:
     * id: primary key
     * username: user's nickname when login to system. This field should be unique.
     * password: md5 string corresponding to user's password, since plain text is not secure
     * accountStatus: this field record the account status, user can cancel his or her account but can also re
     *      reactivate it, so it is not wise to delete rows when user cancel account
     * privilege: every account has a unique privilege and can do different level of things
     * onlinestatus: user's status record whether use is online or offline, more status such as busy, away can also be added
     * 
     * code definition:
     * onlinestatus: 0 offline, 1 online
     * privilege: 0 admin, 1 sub-admin, 2 normal citizen
     * accountstatus: 0 inactive, 1 active
     */
    createTable: function() {
        var sql = "CREATE TABLE User (" +
            "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
            "username CHAR(256) NOT NULL UNIQUE," +
            "password CHAR(256) NOT NULL," +
            "onlinestatus INTEGER NOT NULL," +
            "accountstatus INTEGER NOT NULL," +
            "privilege INTEGER NOT NULL" +
            ");";
        return sql;
    },

    dropTable: function() {
        var sql = "DROP TABLE IF EXISTS User;";
        return sql;
    },

    getAllUsers: function () {
        var sql = "SELECT username, onlinestatus, accountstatus, privilege, status_code, timestamp, location FROM User, Status WHERE User.id = Status.userid ORDER BY onlinestatus DESC, username ASC;";
        return sql;
    },

    insertAdminUser: function(adminpwd) {
        var sql = "INSERT INTO User (username, password, onlinestatus, accountstatus, privilege) VALUES ('admin','" + adminpwd + "', 0, 0, 0)";
        return sql;
    },

    getUser: function () {
        var sql = "SELECT * FROM User WHERE username = ?;";
        return sql;
    },

    insertUser: function () {
        var sql = "INSERT INTO User (username, password, onlinestatus, accountstatus, privilege) VALUES (?, ?, 1, 0, 0)";
        return sql;
    },

    validUsernameAndPassword: function () {
        var sql = "SELECT * FROM User WHERE username = ? AND password = ?;";
        return sql;
    },

    updateUserOnline: function () {
        var sql = "UPDATE User SET onlinestatus = 1 WHERE username = ?;";
        return sql;
    },

    updateUserOffline: function () {
        var sql = "UPDATE User SET onlinestatus = 0 WHERE username = ?;";
        return sql;
    }
};
