"use strict";

var express = require('express');
var router = express.Router();
var config = require('../config/global.js');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile('index.html');
});

router.get('/currentUsername', function(req, res, next) {
    res.status(200).send({"currentUsername": req.session.loginUser});
});

router.post('/notification',function(req, res, next) {
    //console.log("haha"+req.body.timestamp);
    req.io.emit('notification',{"username":req.body.username,"timestamp":req.body.timestamp,"content":req.body.content,"type":req.body.type,"sound":req.body.sound});
    res.status(200).send({"currentUsername": req.session.loginUser});
});


router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if(err)
            res.sendStatus(500);
        res.clearCookie("session");
        res.sendStatus(200);
    });
});

module.exports = router;
