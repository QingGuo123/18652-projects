"use strict";

module.exports = {

    /**
     * fields declaration:
     * id: primary key
     * userid: user's id in table 'User'
     * content: the content of an announcement
     * timestamp: the time at which the announcement is posted
     * location: the location where the announcement is posted
     */
    createTable: function() {
        var sql = "CREATE TABLE Announcement (" +
            "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
            "userid INTEGER NOT NULL," +
            "content TEXT," +
            "timestamp CHAR(256) NOT NULL," +
            "location CHAR(256)," +
            "FOREIGN KEY (userid) REFERENCES User(id)" +
            ");";
        return sql;
    },

    dropTable: function() {
        var sql = "DROP TABLE IF EXISTS Announcement;";
        return sql;
    },

    getAllAnnouncements: function () {
        var sql = "SELECT username, content, timestamp, location FROM Announcement, User WHERE User.id = Announcement.userid ORDER BY timestamp;";
        return sql;
    },

    insertAnnouncement: function() {
        var sql = "INSERT INTO Announcement (userid, content, timestamp, location) VALUES ((SELECT id FROM User WHERE username = ?), ?, ?, ?)";
        return sql;
    }

};
