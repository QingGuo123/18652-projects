"use strict";

module.exports = {

    /**
     * fields declaration:
     * id: primary key
     * userid: user's id in table 'User'
     * status_code: the code of a status:
     *      0: OK
     *      1: Help
     *      2: Emergency
     *      -1: Undefined
     * timestamp: the time at which the status is posted
     * location: the location where the status is posted
     */
    createTable: function() {
        var sql = "CREATE TABLE Status (" +
            "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
            "userid INTEGER NOT NULL," +
            "status_code INTEGER NOT NULL," +
            "timestamp CHAR(256) NOT NULL," +
            "location CHAR(256)," +
            "FOREIGN KEY (userid) REFERENCES User(id)" +
            ");";
        return sql;
    },

    dropTable: function() {
        var sql = "DROP TABLE IF EXISTS Status;";
        return sql;
    },

    insertStatus: function() {
        var sql = "INSERT INTO Status (userid, status_code, timestamp, location) VALUES ((SELECT id FROM User WHERE username = ?), ?, ?, ?)";
        return sql;
    },

    updateStatus: function() {
        var sql = "UPDATE Status SET status_code = ?, " +
                "timestamp = ?, " +
                "location = ? " +
                "WHERE userid = (SELECT id FROM User WHERE username = ?);";
        return sql;
    },

    getStatus: function () {
        var sql = "SELECT username, status_code, timestamp, location FROM Status, User WHERE username = ? AND User.id = Status.userid;";
        return sql;
    }

};
