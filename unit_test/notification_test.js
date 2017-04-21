var expect = require('expect.js');

var User = require('../models/user.js');
var Notification = require('../models/notification.js');

var init_db = require('../db/init_db');
var config = require('../config/global.js');

var user1 = {
    username: 'Eric2',
    password:'123123123',
    content: 'Hello World!',
    timestamp:'24:00',
    type:'NO'
};

var user2 = {
    username: 'Minghao2',
    password:'123123123',
    content: 'Bye World!',
    timestamp: '00:00',
    type: 'OFF'
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

    test(' - Identify a exist user can post a notification', function (done) {
        var notification = new Notification(user1.username, user1.content, user1.timestamp, user1.location);
        notification.postNotification(function (res, err) {
            expect(err).to.equal(null);
            expect(res.postNotificationResult).to.equal(0);
            done();
        });
    });

    test(' - Identify a non-exist user cannot post a notification', function (done) {
        var notification = new Notification(user2.username, user2.content, user2.timestamp, user2.type);
        notification.postNotification(function (res, err) {
            expect(err.message).to.equal('User not existed.');
            expect(res).to.equal(null);
            done();
        });
    });

    test(' - Identify a exist user can get notification', function (done) {
        var notification = new Notification(user1.username, user1.content, user1.timestamp, user1.type);
        Notification.getNotifications(function (notifications, err) {
            expect(err).to.equal(null);
            expect(notifications[0].username).to.equal(notification.username);
            expect(notifications[0].content).to.equal(notification.content);
            expect(notifications[0].timestamp).to.equal(notification.timestamp);
            //expect('NO').to.equal(notification.type);
            done();
        }, {'username': user1.username});
    });

    // test(' - Identify a non-exist user cannot get notification', function (done) {
    //     Notification.getNotifications(function (messages, err) {
    //         expect(err.message).to.equal('User not existed.');
    //         expect(messages).to.equal(null);
    //         done();
    //     }, {'username': user2.username});
    // });

    test('-reset the test db', function (done) {
        init_db.resetTestDB(function () {
            done();
        });
    });

});