/**
 * Created by jinliang on 3/22/17.
 */
var expect = require('expect.js');
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


suite('Test user component', function () {

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

    test('- Identify whether able to get the exist test_user', function (done) {
        User.getUser(function (user, err) {
            expect(err).to.not.be.ok();
            expect(user.username).to.equal(user1.username);
            done();
        }, {"username": user1.username});

    });

    test(' - Identify whether able to get all exist test_users', function (done) {
        User.getAllUsers(function (users, err) {
            expect(err).to.not.be.ok();
            expect(users[0].username).to.equal(user1.username);
            done();
        }, {"username": user1.username});

    });

    test(' - Identify not able to get a non-exist user', function (done) {
        User.getUser(function (user, err) {
            // expect(err).to.not.be.ok();
            expect(user).to.equal(null);
            expect(err.message).to.equal('User not existed.');
            done();
        }, {"username": user2.username});

    });

    test('-reset the test db', function (done) {
        init_db.resetTestDB(function () {
            done();
        });
    });

});
