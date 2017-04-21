angular.module('ESNApp', ['angular-md5']).controller('homePageController',['$scope', '$http', '$location', 'md5', function ($scope, $http, $location, md5) {

	var socket = io();

		$scope.username = '';
		$scope.password = '';
		$scope.validation = {
			username: function() {
				var userlen = $scope.username.length;
				var savekeywords = $scope.username.match(/^about$|^access$|^account$|^accounts$|^add$|^address$|^adm$|^admin$|^administration$|^adult$|^advertising$|^affiliate$|^affiliates$|^ajax$|^analytics$|^android$|^anon$|^anonymous$|^api$|^app$|^apps$|^archive$|^atom$|^auth$|^authentication$|^avatar$|^backup$|^banner$|^banners$|^bin$|^billing$|^blog$|^blogs$|^board$|^bot$|^bots$|^business$|^chat$|^cache$|^cadastro$|^calendar$|^campaign$|^careers$|^cgi$|^client$|^cliente$|^code$|^comercial$|^compare$|^config$|^connect$|^contact$|^contest$|^create$|^code$|^compras$|^css$|^dashboard$|^data$|^db$|^design$|^delete$|^demo$|^design$|^designer$|^dev$|^devel$|^dir$|^directory$|^doc$|^docs$|^domain$|^download$|^downloads$|^edit$|^editor$|^email$|^ecommerce$|^forum$|^forums$|^faq$|^favorite$|^feed$|^feedback$|^flog$|^follow$|^file$|^files$|^free$|^ftp$|^gadget$|^gadgets$|^games$|^guest$|^group$|^groups$|^help$|^home$|^homepage$|^host$|^hosting$|^hostname$|^html$|^http$|^httpd$|^https$|^hpg$|^info$|^information$|^image$|^img$|^images$|^imap$|^index$|^invite$|^intranet$|^indice$|^ipad$|^iphone$|^irc$|^java$|^javascript$|^job$|^jobs$|^js$|^knowledgebase$|^log$|^login$|^logs$|^logout$|^list$|^lists$|^mail$|^mail1$|^mail2$|^mail3$|^mail4$|^mail5$|^mailer$|^mailing$|^mx$|^manager$|^marketing$|^master$|^me$|^media$|^message$|^microblog$|^microblogs$|^mine$|^mp3$|^msg$|^msn$|^mysql$|^messenger$|^mob$|^mobile$|^movie$|^movies$|^music$|^musicas$|^my$|^name$|^named$|^net$|^network$|^new$|^news$|^newsletter$|^nick$|^nickname$|^notes$|^noticias$|^ns$|^ns1$|^ns2$|^ns3$|^ns4$|^old$|^online$|^operator$|^order$|^orders$|^page$|^pager$|^pages$|^panel$|^password$|^perl$|^pic$|^pics$|^photo$|^photos$|^photoalbum$|^php$|^plugin$|^plugins$|^pop$|^pop3$|^post$|^postmaster$|^postfix$|^posts$|^profile$|^project$|^projects$|^promo$|^pub$|^public$|^python$|^random$|^register$|^registration$|^root$|^ruby$|^rss$|^sale$|^sales$|^sample$|^samples$|^script$|^scripts$|^secure$|^send$|^service$|^shop$|^sql$|^signup$|^signin$|^search$|^security$|^settings$|^setting$|^setup$|^site$|^sites$|^sitemap$|^smtp$|^soporte$|^ssh$|^stage$|^staging$|^start$|^subscribe$|^subdomain$|^suporte$|^support$|^stat$|^static$|^stats$|^status$|^store$|^stores$|^system$|^tablet$|^tablets$|^tech$|^telnet$|^test$|^test1$|^test2$|^test3$|^teste$|^tests$|^theme$|^themes$|^tmp$|^todo$|^task$|^tasks$|^tools$|^tv$|^talk$|^update$|^upload$|^url$|^user$|^username$|^usuario$|^usage$|^vendas$|^video$|^videos$|^visitor$|^win$|^ww$|^www$|^www1$|^www2$|^www3$|^www4$|^www5$|^www6$|^www7$|^wwww$|^wws$|^wwws$|^web$|^webmail$|^website$|^websites$|^webmaster$|^workshop$|^xxx$|^xpg$|^you$|^yourname$|^yourusername$|^yoursite$|^yourdomain$/);
				$scope.userdisable = false;
				if (userlen < 3 || savekeywords) {
					$scope.userdisable = true;
					if (userlen < 3){
						return "Username should be at least three characters";
					}
					if (savekeywords) {
						return "Username invalid, please choose another name";
					}
				}else{
					return "Username valid";
				}
			},
			password : function() {
				var passwordlen = $scope.password.length;
				$scope.passworddisable = false;
				if (passwordlen < 6) {
					$scope.passworddisable = true;
					return "Password should be at least six characters";
				}else{
					return "Password valid";
				}
			}
		};
		$scope.login_or_signup = function() {
			var username = $scope.username;
			var password = md5.createHash($scope.password);
			
			$http({
			  method: 'GET',
			  url: ('/users/' + username)
			}).then(function successCallback(response) {
			    $http.post('/users', {
					"username": username,
					"password": password
				}).then(function successCallback(response) {
					socket.emit("userLogin", {"username": username});
					if(response.data.regOrLoginResult === 1){
						alert("Incorrect password!");
				    }else if(response.data.regOrLoginResult === 2){
				    	window.location.href = "/landingPage.html";
				    }
				}, function errorCallback(response) {
					$scope.message="Login failed, please check your user name and password.";
				});
			    
			  }, function errorCallback(response) {
		    	if (confirm("Are you sure to create a new user?")) {
		    		alert('Welcome to ESN! All four statuses are as follow: OK --> I am OK, I do not need help --> Green Help --> I need help, but this is not a life threatening emergency --> Yellow Emergency --> I need help now, as this is a life threatening emergency --> Red Undefined --> The user has not been providing her status yet. Choose your statuses in the radio box!');
				    $http.post('/users', {
						"username": username,
						"password": password
					}).then(function successCallback(response) {
						socket.emit("userLogin", {"username": username});
						// Take in the response information
						console.log("post successfully");
						window.location.href = "/landingPage.html";
					}, function errorCallback(response) {
						$scope.message="Login failed, please check your user name and password.";
					});
		    	}
			});
		};
	}]);