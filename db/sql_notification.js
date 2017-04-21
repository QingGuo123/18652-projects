module.exports = {

    /**
     * fields declaration:
     * id: primary key
     * userid: user's id in table 'User'
     * content: the content of a notification
     * timestamp: the time at which the notification is posted
     * type: the type of notification
     */
    createTable: function() {
        var sql = "CREATE TABLE Notification (" +
            "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
            "userid INTEGER NOT NULL," +
            "content TEXT," +
            "timestamp CHAR(256) NOT NULL," +
            "type CHAR(256)," +
            "FOREIGN KEY (userid) REFERENCES User(id)" +
            ");";
        return sql;
    },

    dropTable: function() {
        var sql = "DROP TABLE IF EXISTS Notification;";
        return sql;
    },

    getNotifications: function () {
        var sql = "SELECT username, content, timestamp, type FROM Notification, User WHERE User.id = Notification.userid ORDER BY timestamp;";
        return sql;
    },

    insertnotification: function() {
        var sql = "INSERT INTO Notification (userid, content, timestamp, type) VALUES ((SELECT id FROM User WHERE username = ?), ?, ?, ?)";
        return sql;
    },

};
