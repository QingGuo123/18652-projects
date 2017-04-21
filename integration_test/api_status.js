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

suite('restAPI_status', function () {
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

    test('-Should update the test user`s status', function (done) {
        agent.post(HOST + '/status')
            .set('Content-Type','application/x-www-form-urlencoded')
            .send({username: user1.username, status_code: 0, timestamp:user1.timestamp, location:user1.location})
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                expect(res.body.postStatusResult).to.equal(user1.status_code);
                console.log("123123123");
                done();
            });
    });

    test('-Should retrieve the test user`s status', function (done) {
        var req = agent.get(HOST + '/status/' + user1.username);
        req
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                console.log(res.body);
                expect(res.body.status.username).to.equal(user1.username);
                expect(res.body.status.status_code).to.equal(0);
                expect(res.body.status.timestamp).to.equal(user1.timestamp);
                expect(res.body.status.location).to.equal(user1.location);
                done();
            });
    });

    test('-Should return 404 when update a non-existing user`s status', function (done) {
        var req = agent.post(HOST + '/status');
        req
            .set('Content-Type','application/x-www-form-urlencoded')
            .send({username: user3.username, status_code: user3.status_code, timestamp: user3.timestamp, location:user3.location})
            .end(function (err, res) {
                expect(err).to.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(404);
                done();
            });
    });

    test('-Should return 404 when retrieve a non-existing user`s status', function (done) {
        var req = agent.get(HOST + '/status/' + user3.username);
        req
            .end(function (err, res) {
                expect(err).to.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(404);
                done();
            });
    });

    test('-reset the test db', function (done) {
        init_db.resetTestDB(function () {
            done();
        });;
    });

});