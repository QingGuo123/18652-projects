"use strict";

module.exports = {

    /**
     * fields declaration:
     * id: primary key
     * senderid: sender's id in table 'User'
     * receiverid: receiverid's id in table 'User'
     * content: the content of a private message
     * timestamp: the time at which the private message is posted
     * location: the location where the private message is posted
     * status_code: the status of the sender when the private message is posted
     * isnew: whether the private message has been read by the receiver
     *      0: not new
     *      1: is new
     */
    createTable: function() {
        var sql = "CREATE TABLE PrivateMessage (" +
            "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
            "senderid INTEGER NOT NULL," +
            "receiverid INTEGER NOT NULL," +
            "content TEXT," +
            "timestamp CHAR(256) NOT NULL," +
            "location CHAR(256)," +
            "status_code INTEGER," +
            "isnew INTEGER NOT NULL," +
            "FOREIGN KEY (senderid) REFERENCES User(id)" +
            "FOREIGN KEY (receiverid) REFERENCES User(id)" +
            ");";
        return sql;
    },

    dropTable: function() {
        var sql = "DROP TABLE IF EXISTS PrivateMessage;";
        return sql;
    },

    insertPrivateMessage: function() {
        var sql = "INSERT INTO PrivateMessage (senderid, receiverid, content, timestamp, location, status_code, isnew) VALUES ((SELECT id FROM User WHERE username = ?), (SELECT id FROM User WHERE username = ?), ?, ?, ?, (SELECT status_code FROM Status, User WHERE Status.userid = User.id AND username = ?), 1);";
        return sql;
    },

    getPrivateMessageBySenderAndReceiver: function() {
        var sql = "SELECT a.username sender, b.username receiver, content, timestamp, location, status_code, isnew FROM PrivateMessage, User a, User b WHERE ((PrivateMessage.senderid = (SELECT id FROM User WHERE username = ?) AND PrivateMessage.receiverid = (SELECT id FROM User WHERE username = ?)) OR (PrivateMessage.receiverid = (SELECT id FROM User WHERE username = ?) AND PrivateMessage.senderid = (SELECT id FROM User WHERE username = ?))) AND a.id = senderid AND b.id = receiverid ORDER BY timestamp;";
        return sql;
    },

    getNewPMNumByReceiver: function() {
        var sql = "SELECT username sender, COUNT(PrivateMessage.id) newpms FROM User, PrivateMessage WHERE PrivateMessage.senderid = User.id AND receiverid = (SELECT id FROM User WHERE username = ?) AND isnew = 1 GROUP BY senderid;";
        return sql;
    },

    resetUnreadMessages: function() {
        var sql = "UPDATE PrivateMessage SET isnew = 0 WHERE senderid = (SELECT id FROM User WHERE username = ?) AND receiverid = (SELECT id FROM User WHERE username = ?);";
        return sql;
    }

};
