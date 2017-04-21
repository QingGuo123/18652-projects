/**
 * Created by jinliang on 4/5/17.
 */
var PORT = process.env.PORT | 3000;
var HOST = 'http://localhost:' + PORT;

var init_db = require('../db/init_db');
var config = require('../config/global.js');
var db_path = config.db_config.ESN_db.path;

//Init a server
var debug = require('debug')('ESN');
var app = require('../app.js');

app.set('port', PORT);
app.set('testing', true);

var serverInit = function () {
    debug('Express server listening on port' + PORT);
};

var server = app.listen(app.get('port'), serverInit)
    .on('error', function(err){
        console.log(err.code);
        if(err.code === 'EADDRINUSE'){

            PORT++;
            HOST = 'http://localhost:'+PORT;
            app.set('port', PORT);
            console.log('if change ' + HOST);
            server = app.listen(app.get('port'), serverInit)
        }
    });


// init_db.resetTestDB(function () {             done();         });;
module.exports = HOST;