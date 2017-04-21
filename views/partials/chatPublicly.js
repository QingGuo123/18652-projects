var app = angular.module('ESNApp', []);
app.filter('myfilter', function() {

    return function(items, name) {
        var filtered = [];

        angular.forEach(items, function(item) {

            if (name == undefined || name == '') {
                filtered.push(item);
            } else if (item.name_key !== name) {
                filtered.push(item);
            }
        });

        return filtered;
    };
});


app.controller('chatPublicController', function($scope, $location, $http, $timeout) {

        var socket = io();
        socket.on("connect", function() {
            console.log("User connected via Socket io!");
        });

        $scope.currentMsg = "";
        $scope.curUsername = "";


        $scope.limitNum = 10;
        $scope.totalNum = 0;
        $scope.stopwords = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off', 'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to', 'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet', 'you', 'your'];
        $scope.searchChatMsg = "";


        $scope.nextPublicMsg = function() {
            if ($scope.limitNum >= $scope.totalNum) {
                alert("No More Public Message");
            } else {
                $scope.limitNum += 10;
            }
        }

        $scope.previousPublicMsg = function() {
            if ($scope.limitNum <= 10) {
                alert("No Previous Public Message");
            } else {
                $scope.limitNum -= 10;
            }
        }
        $scope.sendMessage = function() {
            var timestamp = new Date();
            $http.get('/currentUsername').then(function successCallback(response) {

                $scope.curUsername = response.data.currentUsername;
                console.log($scope.curUsername + " + " + $scope.currentMsg + " + " + timestamp);
                $http.post('/messages/public', {
                    "username": $scope.curUsername,
                    "content": $scope.currentMsg,
                    "timestamp": timestamp,
                    "location": "Mountain View"
                }).then(function successCallback(response) {
                    // Take in the response information
                    console.log("post successfully");
                }, function errorCallback(response) {
                    console.log("Login failed, please check your user name and password.");
                });

                socket.emit("message", {
                    "username": $scope.curUsername,
                    "content": $scope.currentMsg,
                    "timestamp": timestamp
                });
                $scope.currentMsg = "";

            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });

        };


        var getAllPublicMessages = function() {
            $http.get('/currentUsername').then(function successCallback(response) {
                console.log("response.status: " + response.status);
                var myBody = document.getElementById('chatPubliclyBody');
                myBody.style.display = 'block';
                $http.get('/messages/public').then(function(response) {
                    for (var index = 0; index < response.data.messages.length; index++) {
                        if (response.data.messages[index].status_code == -1) {
                            response.data.messages[index].status_code = "fa fa-circle";
                            response.data.messages[index].iconcolor = "white";
                        } else if (response.data.messages[index].status_code == 0) {
                            response.data.messages[index].status_code = "fa fa-circle";
                            response.data.messages[index].iconcolor = "green";
                        } else if (response.data.messages[index].status_code == 1) {
                            response.data.messages[index].status_code = "fa fa-circle";
                            response.data.messages[index].iconcolor = "yellow";
                        } else {
                            response.data.messages[index].status_code = "fa fa-circle";
                            response.data.messages[index].iconcolor = "red";
                        }
                    }
                    $scope.messages = response.data.messages;
                    $scope.totalNum = $scope.messages.length;
                    $scope.limitNum = $scope.totalNum;
                    console.log($scope.messages);
                });
            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        };

        getAllPublicMessages();

        socket.on("message", function(obj) {

            getAllPublicMessages();
        });

    })
    .controller('announcementPageCtrl', function($scope, $location, $http, $timeout) {

        var socket = io();

        $scope.limitNum = 10;
        $scope.totalNum = 0;
        $scope.stopwords = ['a', 'able', 'about', 'across', 'after', 'all', 'almost', 'also', 'am', 'among', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'but', 'by', 'can', 'cannot', 'could', 'dear', 'did', 'do', 'does', 'either', 'else', 'ever', 'every', 'for', 'from', 'get', 'got', 'had', 'has', 'have', 'he', 'her', 'hers', 'him', 'his', 'how', 'however', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'least', 'let', 'like', 'likely', 'may', 'me', 'might', 'most', 'must', 'my', 'neither', 'no', 'nor', 'not', 'of', 'off', 'often', 'on', 'only', 'or', 'other', 'our', 'own', 'rather', 'said', 'say', 'says', 'she', 'should', 'since', 'so', 'some', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'tis', 'to', 'too', 'twas', 'us', 'wants', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'yet', 'you', 'your'];
        $scope.searchAnnouncement = "";


        $scope.nextAnnouncement = function() {
            if ($scope.limitNum >= $scope.totalNum) {
                alert("No More Announcement");
            } else {
                $scope.limitNum += 10;
            }
        }

        $scope.previousAnnouncement = function() {
            if ($scope.limitNum <= 10) {
                alert("No Previous Announcement");
            } else {
                $scope.limitNum -= 10;
            }
        }

        $scope.updateAnnouncements = function () {
            $http.get('/messages/announcements').then(function successCallback(response) {
                console.log(response.data.announcements);
                $scope.totalNum = response.data.announcements.length;
                $scope.limitNum = $scope.totalNum;
                $scope.announcements = response.data.announcements;
                $scope.currentAnnouncement = "";
            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        }
        $scope.updateAnnouncements();

        socket.on("announcement", function(obj) {
            $scope.updateAnnouncements();
        });

        $scope.postAnnouncement = function() {
            var timestamp = new Date();
            $http.get('/currentUsername').then(function successCallback(response) {

                $scope.curUsername = response.data.currentUsername;
                $http.post('/messages/announcements', {
                    "username": $scope.curUsername,
                    "content": $scope.currentAnnouncement,
                    "timestamp": timestamp,
                    "location": "Mountain View"
                }).then(function successCallback(response) {
                    // Take in the response information
                    console.log("post successfully");
                    $scope.updateAnnouncements();
                }, function errorCallback(response) {
                    console.log("Login failed, please check your user name and password.");
                });
                socket.emit("announcement", {
                    "username": $scope.curUsername,
                    "content": $scope.currentAnnouncement,
                    "timestamp": timestamp,
                    "location": "Mountain View"
                });

            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        }
    })
    .controller('navbarController', function($scope, $location, $http, $timeout) {
        // handle navbar switch
        $scope.curUser = '';

        $http.get('/currentUsername').then(function(response) {
            $scope.curUser = response.data.currentUsername;

        });

        var socket = io();

        socket.on("notification", function (obj) {
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
                window.location.href = "/index.html";
            }, function errorCallback(response) {
                window.location.href = "/index.html";
            });
        };

    });
