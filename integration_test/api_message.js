/**
 * Created by jinliang on 4/4/17.
 */
var expect = require('expect.js');
var agent = require('superagent');
var HOST = require('./api_port');

var init_db = require('../db/init_db');
var config = require('../config/global.js');
var db_path = config.db_config.ESN_db.path;

//user1 and user2 are logged in as test users, user3 and user4 are not logged in, they are contracting users.
var user1 = {
    username: 'Eric',
    password:'123123123',
    content: 'Hello World!',
    status_code:0,
    timestamp:'24:00',
    location:'129B'
};

var user2 = {
    username: 'Minghao',
    password:'123123123',
    content: 'Bye World!',
    status_code:1,
    timestamp: '00:00',
    location: '129A'
};

var user3 = {
    username: 'Jinliang',
    password:'123123123',
    content: 'Hello World again!',
    status_code:-1,
    timestamp: '00:30',
    location: '230'
};

var user4 = {
    username: 'Qing',
    password:'123123123',
    content: 'Bye World again!',
    status_code:-1,
    timestamp: '12:30',
    location: '228'
};

suite('restAPI_message', function () {

    test('-Should register a user if username not exists', function (done) {
        var req = agent.post(HOST + '/users');
        req
            .set('Content-Type','application/x-www-form-urlencoded')
            .send({username: user1.username, password:user1.password})
            .end(function (err,res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res).to.have.property('body');
                expect(res.statusCode).to.equal(201);
                done();
            });
    });

    test('-Should login the first user if the username has registered', function (done) {
        var req = agent.post(HOST + '/users');
        req
            .set('Content-Type','application/x-www-form-urlencoded')
            .send({username: user1.username, password:user1.password})
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    test('-Identify cannot get all public message cause no public message exists', function (done) {
        var req = agent.get(HOST + '/messages/public/');
        req
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                expect(res.body.messages.length).to.equal(0);
                done();
            });
    });

    test('-Identify a existed user can post a public message', function (done) {
        var req = agent.post(HOST + '/messages/public');
        req
            .send({username:user1.username, content:user1.content, timestamp:user1.timestamp, location: user1.location})
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                expect(res.body.postPublicMessageResult).to.equal(0);
                done();
            });

    });

    test('-Identify a non-existed user can not post a public message', function (done) {
        var req = agent.post(HOST + '/messages/public');
        req
            .send({username: user3.username, content: user3.content, timestamp:user3.timestamp, location: user3.location})
            .end(function (err, res) {
                expect(err).to.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(404);
                done();
            });

    });

    test('-Identify can get public message which is posted by a existed user', function (done) {
        var req = agent.get(HOST + '/messages/public/' + user1.username);
        req
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                expect(res.body.messages.length).to.equal(1);
                expect(res.body.messages[0].username).to.equal(user1.username);
                expect(res.body.messages[0].content).to.equal(user1.content);
                expect(res.body.messages[0].timestamp).to.equal(user1.timestamp);
                expect(res.body.messages[0].location).to.equal(user1.location);
                done();
            });
    });

    test('-Identify cannot get public message which is posted by a non-existed user', function (done) {
        var req = agent.get(HOST + '/messages/public/' + user3.username);
        req
            .end(function (err, res) {
                expect(err).to.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(404);
                done();
            });
    });

    test('-Identify can get all public message if public messages already exist', function (done) {
        var req = agent.get(HOST + '/messages/public/');
        req
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                expect(res.body.messages.length).to.equal(1);
                expect(res.body.messages[0].username).to.equal(user1.username);
                expect(res.body.messages[0].content).to.equal(user1.content);
                expect(res.body.messages[0].timestamp).to.equal(user1.timestamp);
                expect(res.body.messages[0].location).to.equal(user1.location);
                done();
            });
    });

    test('-reset the test db', function (done) {
        init_db.resetTestDB(function () {
            done();
        });
    });

});