"use strict";

module.exports = {

    /**
     * fields declaration:
     * id: primary key
     * userid: user's id in table 'User'
     * content: the content of a message
     * timestamp: the time at which the message is posted
     * location: the location where the message is posted
     * status_code: the status of the sender when the message is posted
     */
    createTable: function() {
        var sql = "CREATE TABLE Message (" +
            "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
            "userid INTEGER NOT NULL," +
            "content TEXT," +
            "timestamp CHAR(256) NOT NULL," +
            "location CHAR(256)," +
            "status_code INTEGER," +
            "FOREIGN KEY (userid) REFERENCES User(id)" +
            ");";
        return sql;
    },

    dropTable: function() {
        var sql = "DROP TABLE IF EXISTS Message;";
        return sql;
    },

    getAllPublicMessages: function () {
        var sql = "SELECT username, content, timestamp, location, status_code FROM Message, User WHERE User.id = Message.userid ORDER BY timestamp;";
        return sql;
    },

    insertMessage: function() {
        var sql = "INSERT INTO Message (userid, content, timestamp, location, status_code) VALUES ((SELECT id FROM User WHERE username = ?), ?, ?, ?, (SELECT status_code FROM Status, User WHERE Status.userid = User.id AND username = ?))";
        return sql;
    },

    getPublicMessage: function () {
        var sql = "SELECT username, content, timestamp, location, status_code FROM Message, User WHERE username = ? AND User.id = Message.userid ORDER BY timestamp;";
        return sql;
    }

};
