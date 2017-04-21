"use strict";

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var config = require('./config/global.js');
var io = require('./socket/socket.js');
var check_session = config.test_config.check_session;

var app = express();
var server = require('http').createServer(app);
io.listen(server);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'views/partials')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(session({
    name: 'session',
    secret: 'secret',
    store: new FileStore({logFn: function(){}}),
    cookie: {maxAge: 3600 * 1000},
    saveUninitialized: false,
    resave: false
}));

app.use(function (req, res, next) {
    if (!check_session)
        next();
    else if (!(req.method === "POST" && req.url === "/users") && !(req.method === "GET" && req.url.match(/\/users\/.*/))) {
        var sess = req.session;
        var loginUser = sess.loginUser;
        var isLogined = !!loginUser;
        if (isLogined) {
            next();
        }
        else
            res.sendStatus(404);
    }
    else
        next();
});

app.use(function (req,res,next) {
    req.io = io;
    next();
});

// routes
var index = require('./routes/index');
var users = require('./routes/users');
var messages = require('./routes/messages');
var status = require('./routes/status');
app.use('/', index);

app.use('/users', users);
app.use('/messages', messages);
app.use('/status', status);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

});

module.exports = {app:app,server:server};
