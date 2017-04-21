var app = angular.module('ESNApp', []);

app.service('iteratePrivateMessages', function() {
    this.myFunc = function(privateMsgArr, currentUsername) {
        for (var index = 0; index < privateMsgArr.length; index++) {
            if (privateMsgArr[index].status_code == -1) {
                privateMsgArr[index].status_code = "fa fa-circle";
                privateMsgArr[index].iconcolor = "white";
            } else if (privateMsgArr[index].status_code == 0) {
                privateMsgArr[index].status_code = "fa fa-circle";
                privateMsgArr[index].iconcolor = "green";
            } else if (privateMsgArr[index].status_code == 1) {
                privateMsgArr[index].status_code = "fa fa-circle";
                privateMsgArr[index].iconcolor = "yellow";
            } else {
                privateMsgArr[index].status_code = "fa fa-circle";
                privateMsgArr[index].iconcolor = "red";
            }

            if (privateMsgArr[index].sender == currentUsername) {
                privateMsgArr[index].sender = "You";
            }
            if (privateMsgArr[index].receiver == currentUsername) {
                privateMsgArr[index].receiver = "You";
            }
        }
        return privateMsgArr;
    };
});


app.controller('lobbyPageController', function($scope, $state, $location) {
        $scope.username = User.getUsername();
        if (User.getLoginorSignup() == "login") {
            $scope.signuporlogin = "back ";
        } else {
            $scope.signuporlogin = "newcomer";
        }

    })


    .controller('userDirectoryController', function($scope, $http, $location, iteratePrivateMessages) {
        
        var socket = io();

        $scope.users = '';

        socket.on("error", function() {
            alert("Update directory error.");
        });

        $scope.searchStatusArr = ['Emergency', 'Help', 'Normal'];

        $scope.limitNum = 10;
        $scope.totalNum = 0;
        $scope.stopwords = ['a','able','about','across','after','all','almost','also','am','among','an','and','any','are','as','at','be','because','been','but','by','can','cannot','could','dear','did','do','does','either','else','ever','every','for','from','get','got','had','has','have','he','her','hers','him','his','how','however','i','if','in','into','is','it','its','just','least','let','like','likely','may','me','might','most','must','my','neither','no','nor','not','of','off','often','on','only','or','other','our','own','rather','said','say','says','she','should','since','so','some','than','that','the','their','them','then','there','these','they','this','tis','to','too','twas','us','wants','was','we','were','what','when','where','which','while','who','whom','why','will','with','would','yet','you','your'];
        $scope.searchPriMsg = "";

        $scope.nextPrivateMsg = function() {
            if ($scope.limitNum >= $scope.totalNum) {
                alert("No More Private Message");
            } else {
                $scope.limitNum += 10;
            }
        };

        $scope.previousPrivateMsg = function() {
            if ($scope.limitNum <= 10) {
                alert("No Previous Private Message");
            } else {
                $scope.limitNum -= 10;
            }
        };
        
        var updateDirectory = function() {
            $http.get('/users').then(function successCallback(response) {
                var users_temp = [];
                users_temp = response.data.users;

                for (var i = 0; i < users_temp.length; i++) {
                    if (users_temp[i].onlinestatus == 1) {
                        users_temp[i].onlinestatus = "Online";
                    } else {
                        users_temp[i].onlinestatus = "Offline";
                    }
                    if (users_temp[i].status.status_code == -1) {
                        users_temp[i].status.status_code = "Undefined";
                    } else if (users_temp[i].status.status_code == 0) {
                        users_temp[i].status.status_code = "Normal";
                    } else if (users_temp[i].status.status_code == 1) {
                        users_temp[i].status.status_code = "Help";
                    } else {
                        users_temp[i].status.status_code = "Emergency";
                    }
                }
                $scope.users = users_temp;
                console.log($scope.users);
            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        };

        $http.get('/currentUsername').then(function successCallback(response) {
            var myBody = document.getElementById('landingPageBody'); //improper variable name. should be the exact name of this body
            myBody.style.display = 'block';

            socket.emit("startChatPrivately", { "username": response.data.currentUsername }); // uniform the format of {}
            socket.on("ev_to" + response.data.currentUsername, function(obj) {
                if ($scope.chatWithWhom == obj.from || $scope.chatWithWhom == obj.to) {
                    $scope.privateMsgs; // should be initialized
                    $http.get('/currentUsername').then(function successCallback(response) {
                        var currentUsername = response.data.currentUsername;
                        $http.get('/messages/private/' + obj.from + '/' + obj.to).then(function successCallback(response) {

                            $scope.privateMsgs = iteratePrivateMessages.myFunc(response.data.privateMessages, currentUsername);

                            $scope.totalNum = $scope.privateMsgs.length;
                            $scope.limitNum = $scope.totalNum;

                            $http.post('/messages/private/resetunread', {
                                "sender": $scope.chatWithWhom,
                                "receiver": currentUsername
                            }).then(function successCallback(response) {
                                // Take in the response information
                                console.log("post successfully");
                                updateDirectory();
                            }, function errorCallback(response) {
                                console.log("Login failed, please check your user name and password.");
                            });
                        });
                    });
                } else {
                    updateDirectory();
                }

            });

            console.log("response.status: " + response.status);

            updateDirectory();
        }, function errorCallback(response) {
            window.location.href = "/index.html";
        });

        socket.on("updateDirectory", function() {
            updateDirectory();
        });

        $scope.sendPrivateMsg = function() {
            var timestamp = new Date();
            $http.get('/currentUsername').then(function successCallback(response) {
                var from = response.data.currentUsername;

                $http.post('/messages/private', {
                    "sender": from,
                    "receiver": $scope.chatWithWhom,
                    "content": $scope.currentChatPrivatelyMsg,
                    "timestamp": timestamp,
                    "location": "Mountain View",
                }).then(function successCallback(response) {
                    // Take in the response information
                    $http.get('/currentUsername').then(function successCallback(response) {
                        var from = response.data.currentUsername;
                        $http.get('/messages/private/' + from + '/' + $scope.chatWithWhom).then(function successCallback(response) {
                            $scope.privateMsgs = iteratePrivateMessages.myFunc(response.data.privateMessages, from);
                            console.log($scope.privateMsgs);
                        });
                    });
                    
                    console.log("post successfully");
                }, function errorCallback(response) {
                    console.log("Login failed, please check your user name and password.");
                });

                socket.emit("privateMessage", {
                    "from": from,
                    "to": $scope.chatWithWhom,
                    "message": {
                        "content": $scope.currentChatPrivatelyMsg,
                        "timestamp": timestamp,
                        "location": "Mountain View"
                    }
                });

                $scope.currentChatPrivatelyMsg = "";

            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        };

        $scope.chatWithSb = function(chatUsername) {
            $scope.chatPrivateBool = true;
            $scope.chatWithWhom = chatUsername;
            $scope.privateMsgs;
            $http.get('/currentUsername').then(function successCallback(response) {
                var from = response.data.currentUsername; // we'd better not use 'from', just use 'currentUsername'
                $http.get('/messages/private/' + from + '/' + chatUsername).then(function successCallback(response) {
                    
                    $scope.privateMsgs = iteratePrivateMessages.myFunc(response.data.privateMessages, from);
                    $scope.totalNum = $scope.privateMsgs.length;
                    $scope.limitNum = $scope.totalNum;

                    $http.post('/messages/private/resetunread', {
                        "sender": chatUsername,
                        "receiver": from
                    }).then(function successCallback(response) {
                        // Take in the response information
                        console.log("post successfully");
                        updateDirectory();
                    }, function errorCallback(response) {
                        console.log("Login failed, please check your user name and password.");
                    });
                });
            });
        };

        $scope.exit = function() {
            $scope.chatPrivateBool = false;
            $scope.chatWithWhom = "";
        };

    })
    .controller('statusController', function($scope, $location, $http, $timeout) {
        var socket = io();
        $scope.updateStatus = function() {

            var curUsername; // unused variable
            var curStatus_code;
            var timestamp = new Date();
            var location = "Mountain View";

            if ($scope.status == "Ok") {
                curStatus_code = 0; // whether the code of status can be defined in a global erea?
            } else if ($scope.status == "Help") {
                curStatus_code = 1;
            } else if ($scope.status == "Emergency") {
                curStatus_code = 2;
            } else {
                curStatus_code = -1;
            }

            $http.get('/currentUsername').then(function successCallback(response) {
                var curUsername = response.data.currentUsername;
                $http.post('/status', {
                    "username": curUsername,
                    "status_code": curStatus_code,
                    "timestamp": timestamp,
                    "location": location
                }).then(function successCallback(response) {
                    // Take in the response information
                    console.log("post successfully");
                }, function errorCallback(response) {
                    console.log("Login failed, please check your user name and password.");
                });
                socket.emit("status");
            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        };
    })
    .controller('notifyController', function($scope, $location, $http, $timeout) {
        //$scope.username = User.getUsername();
        $scope.message = '';
        $scope.types = ["Normal", "Emergency"];
        $scope.sound = ["OFF", "ON"];
        $scope.totalNum = 0;
        $scope.limitNum = 10;
        $scope.notifications = '';
        $http.get('/currentUsername').then(function(response) {
            $scope.curUser = response.data.currentUsername;

        });
        $scope.validation = {
            message : function() {
                var messagelen = $scope.message.length;
                $scope.passworddisable = false;
                if (messagelen > 20) {
                    $scope.passworddisable = true;
                    return "The length of content should be less than 20";
                }else{
                    return "content valid";
                }
            }
        };


        $scope.postNotification = function () {
            var socket = io();

            var date = new Date();
            var timestamp = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
            var type = $scope.selectedType;
            var sound = $scope.selectedSound;
            var content = $scope.message;

            $http.get('/currentUsername').then(function successCallback(response) {
                var username = response.data.currentUsername;
                console.log(username);
                $http.post('/notification', {
                    "username": username,
                    'timestamp': timestamp,
                    'content': content,
                    'type': type,
                    'sound': sound
                }).then(function successCallback(response) {
                    // Take in the response information
                    console.log("post successfully");
                }, function errorCallback(response) {
                    console.log("Post Failed");
                });
                $http.post('/messages/notification', {
                    "username": username,
                    'timestamp': timestamp,
                    'content': content,
                    'type': type,
                    'sound': sound
                }).then(function successCallback(response) {
                    // Take in the response information
                    console.log("post successfully");
                }, function errorCallback(response) {
                    console.log("Post Failed");
                });
            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        };
        $scope.getNotifications = function () {
            $http.get('/messages/notification').then(function successCallback(response) {
                console.log(response.data.notifications[0].content);
                $scope.totalNum = response.data.notifications.length;
                $scope.limitNum = $scope.totalNum;
                $scope.notifications = response.data.notifications;
                //$scope.currentNotification = "";
            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        }
    })

    .controller('navbarController', function($scope, $location, $http, $timeout) {

        var socket = io();
        socket.on("notification", function (obj) {

            console.log(obj.timestamp);
            $(".modal-header #myModalLabel").text(obj.type+" Notification");
            $(".modal-body #messageid").text("【Message】: "+obj.content+"     # Send By "+obj.username+" #");

            if (obj.sound == 'ON' || obj.type == 'normal') {
                var audio = new Audio('sound/notify.mp3');
                audio.play();
            }
            else if(obj.sound == 'ON' || obj.type == 'emergency'){
                var audio = new Audio('sound/emergency.mp3');
                audio.play();
            }
            $('#notiModal').modal({
            }).show();
        });

        $http.get('/currentUsername').then(function(response) {
            $scope.curUser = response.data.currentUsername;

        });

        // handle navbar switch
        $scope.landingPage = function() {
            console.log("Clicked on landingPage");
            window.location.href = "/landingPage.html";
        };
        $scope.chatPublicly = function() {
            console.log("Clicked on chatPublicly");
            window.location.href = "/chatPublicly.html";
        };

        // handle user login/logout
        $scope.navAdministerPage = "hide";
        $scope.navMeasurePerf = "hide";

        $scope.logout = function() {
            $http.get('/logout').then(function(response) {
                socket.emit("userLogout", { "username": $scope.curUser });
                window.location.href = "/index.html";
            }, function errorCallback(response) {
                socket.emit("userLogout", { "username": $scope.curUser });
                window.location.href = "/index.html";
            });
        };
    });
