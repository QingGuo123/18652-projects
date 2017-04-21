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


suite('restAPI_user', function () {

    // test('-reset the test db', function (done) {
    //     init_db.resetTestDB(function () {             done();         });;
    //     done();
    // });

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

    test('-Should register another user if username not exists', function (done) {
        var req = agent.post(HOST + '/users');
        req
            .set('Content-Type','application/x-www-form-urlencoded')
            .send({username: user2.username, password:user2.password})
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

    test('-Should login the second user if the username has registered', function (done) {
        var req = agent.post(HOST + '/users');
        req
            .set('Content-Type','application/x-www-form-urlencoded')
            .send({username: user2.username, password:user2.password})
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                done();
            });
    });



    test('-Validate the user if exists', function (done) {
        var req = agent.get(HOST + '/users/' + user1.username);
        req
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res).to.have.property('body');
                expect(res.statusCode).to.equal(200);
                console.log(res.session);
                done();
            });
    });

    test('-Validate user data', function (done) {
        var req = agent.get(HOST + '/users/' + user1.username);
        req
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('body');
                console.log(res.body);
                expect(res.body.username).to.equal(user1.username);
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    test('-Validate a non-exist user if not exist', function (done) {
        var req = agent.get(HOST + '/users/' + user3.username);
        req
            .end(function (err,res) {
                expect(err).to.be.ok();// not sure
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(404);
                done();
            });
    });

    test('-Identify whether able to get all users', function (done) {
        var req = agent.get(HOST + '/users');
        req
            .end(function (err, res) {
                expect(err).to.not.be.ok();
                expect(res).to.have.property('statusCode');
                expect(res.statusCode).to.equal(200);
                console.log(res.body);
                expect(res.body.users.length).to.equal(2);
                expect(res.body.users[0].username).to.equal(user1.username);
                expect(res.body.users[1].username).to.equal(user2.username);
                done();
            });
    });

    test('-reset the test db', function (done) {
        init_db.resetTestDB(function () {
            done();
        });
    });
});