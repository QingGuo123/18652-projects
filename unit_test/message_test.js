/**
 * Created by jinliang on 3/22/17.
 */
var expect = require('expect.js');

var User = require('../models/user.js');
var Message = require('../models/message.js');

var init_db = require('../db/init_db');
var config = require('../config/global.js');

var user1 = {
    username: 'Eric2',
    password:'123123123',
    content: 'Hello World!',
    status_code:0,
    timestamp:'24:00',
    location:'129B'
};

var user2 = {
    username: 'Minghao2',
    password:'123123123',
    content: 'Bye World!',
    status_code:1,
    timestamp: '00:00',
    location: '129A'
};

suite('Test messgage component', function () {

    test('- Identify whether able to register or login', function (done) {
        var test_user = new User(user1.username, user1.password);
        test_user.regOrLogin(function (res1) {
            console.log(res1);
            if(res1.regOrLoginResult == 0){
                //No test_user in DB
                test_user.regOrLogin(function (res2) {
                    expect(res2.regOrLoginResult).to.equal(2);
                });
            }else{
                //test_user already exists in DB
                expect(res1.regOrLoginResult).to.equal(2);
            }
            done();
        });
    });

    test(' - Identify a exist user can post a public message', function (done) {
        var message = new Message(user1.username, user1.content, user1.timestamp, user1.location);
        message.postPublicMessage(function (res, err) {
            expect(err).to.equal(null);
            expect(res.postPublicMessageResult).to.equal(0);
            done();
        });
    });

    test(' - Identify a non-exist user cannot post a public message', function (done) {
        var message = new Message(user2.username, user2.content, user2.timestamp, user2.location);
        message.postPublicMessage(function (res, err) {
            expect(err.message).to.equal('User not existed.');
            expect(res).to.equal(null);
            done();
        });
    });

    test(' - Identify a exist user can get public message', function (done) {
        var message = new Message(user1.username, user1.content, user1.timestamp, user1.location);
        Message.getPublicMessage(function (messages, err) {
            expect(err).to.equal(null);
            expect(messages[0].username).to.equal(message.username);
            expect(messages[0].content).to.equal(message.content);
            expect(messages[0].timestamp).to.equal(message.timestamp);
            expect(messages[0].location).to.equal(message.location);
            done();
        }, {'username': user1.username});
    });

    test(' - Identify a non-exist user cannot get public message', function (done) {
        Message.getPublicMessage(function (messages, err) {
            expect(err.message).to.equal('User not existed.');
            expect(messages).to.equal(null);
            done();
        }, {'username': user2.username});
    });

    test(' - Identify can get all public message', function (done) {
        var message = new Message(user1.username, user1.content, user1.timestamp, user1.location);
        Message.getAllPublicMessages(function (messages, err) {
            expect(err).to.equal(null);
            expect(messages[0].username).to.equal(message.username);
            expect(messages[0].content).to.equal(message.content);
            expect(messages[0].timestamp).to.equal(message.timestamp);
            expect(messages[0].location).to.equal(message.location);
            done();
        });
    });

    test('-reset the test db', function (done) {
        init_db.resetTestDB(function () {
            done();
        });
    });

});