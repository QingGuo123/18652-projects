/**
 * Created by jinliang on 3/22/17.
 */
var expect = require('expect.js');
var PrivateMessage = require('../models/privateMessage.js');
var User = require('../models/user.js');

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

var user3 = {
    username: 'Jianfeng',
    password:'123123123',
    content: 'Hello World again!',
    status_code:1,
    timestamp: '12:00',
    location: '230'
};

suite('Test private message component', function () {

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

    test('- Identify whether another user is able to register or login ', function (done) {
        var test_user = new User(user3.username, user3.password);
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

    test(' - Identify a exist user can post a private message successfully', function (done) {
        var privateMessage = new PrivateMessage(user1.username, user3.username,user1.content,user1.timestamp, user1.location );
        privateMessage.postPrivateMessage(function (res, err) {
            expect(err).to.equal(null);
            expect(res.postPrivateMessageResult).to.equal(0);
            done();
        });
    });

    test(' - Identify non-exist sender send a private message to a exist receiver', function (done) {
        var privateMessage = new PrivateMessage(user2.username, user3.username,user2.content,user2.timestamp, user2.location );
        privateMessage.postPrivateMessage(function (res, err) {
            expect(res).to.equal(null);
            expect(err.message).to.equal('Sender not existed.');
            done();
        });
    });

    test(' - Identify a exist sender send a private message to a non-exist receiver', function (done) {
        var privateMessage = new PrivateMessage(user1.username, user2.username,user1.content,user1.timestamp, user1.location );
        privateMessage.postPrivateMessage(function (res, err) {
            expect(res).to.equal(null);
            expect(err.message).to.equal('Receiver not existed.');
            done();
        });
    });

    test(' - Identify a exist receiver resets a unread message', function (done) {
        PrivateMessage.resetUnreadMessages(function (res, err) {
            expect(err).to.equal(null);
            expect(res.resetUnreadMessagesResult).to.equal(0);
            done();
        }, {'sender': user1.username, 'receiver': user3.username});
    });

    test(' - Identify a exist receiver get private messages from a exist sender', function (done) {
        var privateMessage = new PrivateMessage(user1.username, user3.username,user1.content,user1.timestamp, user1.location );
        PrivateMessage.getPrivateMessage(function (res,err) {
            expect(err).to.equal(null);
            expect(res[0].sender).to.equal(privateMessage.sender);
            expect(res[0].receiver).to.equal(privateMessage.receiver);
            expect(res[0].content).to.equal(privateMessage.content);
            expect(res[0].timestamp).to.equal(privateMessage.timestamp);
            expect(res[0].location).to.equal(privateMessage.location);
            done();
        }, {'sender': user1.username, 'receiver': user3.username});
    });


    test(' - Identify a non-exist receiver get private messages from a exist sender', function (done) {
        PrivateMessage.getPrivateMessage(function (res,err) {
            expect(err.message).to.equal('Sender not existed.');
            expect(res).to.equal(null);
            done();
        }, {'sender': user2.username, 'receiver': user3.username});
    });

    test(' - Identify a exist receiver get private messages from a non-exist sender', function (done) {
        PrivateMessage.getPrivateMessage(function (res,err) {
            expect(err.message).to.equal('Receiver not existed.');
            expect(res).to.equal(null);
            done();
        }, {'sender': user1.username, 'receiver': user2.username});
    });

    test('-reset the test db', function (done) {
        init_db.resetTestDB(function () {
            done();
        });
    });

});