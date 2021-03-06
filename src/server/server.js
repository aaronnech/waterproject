var express = require('express');
var app = require('./app.js');

var server = express();
server.use(express.bodyParser());
server.use(express.cookieParser('dfjaoekdfsjeo'));
server.use(express.session());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
//asdfadsfasdf
server.post('/login', function(request,response){
	logRequest(request);
	request.accepts('json');
	response.set('Content-Type', 'application/json');
	if(request.body.password != null){
		request.body.password = app.makeHash(request.body);
	}
	app.verifyPass(request.body.user, function(data){
		if(data.success){
			app.findUserByNameNoPass(request.body.user.username, function(ret){
				data.user = ret.user;
				response.json(data);
			});
		} else {
			data.user = null;
			response.json(data);
		}
	});
});

server.post('/register', function(request,response){
	logRequest(request);
	request.accepts('json');
	response.set('Content-Type', 'application/json');
	if(request.body.password != null){
		request.body.password = app.makeHash(request.body);
	}
	app.addUser(request.body.user, function(back){
		response.json(back);
	});
});

server.post('/drink', function(request, response){
	logRequest(request);
	if(request.body.user != null) {
		app.addDrink(request.body, function(back){
			response.json(back);
		});
	} else {
		response.json({"success" : false, "response" : "please log in"});
	}
});

server.post('/total', function(request, response){
	console.log("TOTAL");
	logRequest(request);
	if(request.body.user != null) {
		if(typeof(request.body.day) != 'undefined' && typeof(request.body.month) != 'undefined' &&
			typeof(request.body.year) != 'undefined') {
			app.drinksOnDay(request.body.user, request.body.day, request.body.month, request.body.year, function(drinks){
				console.log("drinks");
				console.log(drinks);
				var back = {};
				if(typeof(drinks != 'undefined')) {
					back.success = true;
					back.result = app.totalDrinks(drinks);
					back.response = "";
				} else {
					back.success = false;
					back.response = "server problem getting total drinks";
				}
				response.json(back);
			});
		} else {
			app.drinksAll(request.body.user, function(drinks){
				console.log("drinks");
				console.log(drinks);
				var back = {};
				if(typeof(drinks != 'undefined')) {
					back.success = true;
					back.result = app.totalDrinks(drinks);
					back.response = "";
				} else {
					back.success = false;
					back.response = "server problem getting drinks";
				}
				response.json(back);
			});
		}
	} else {
		response.json({"success" : false, "response" : "please log in"});
	}
});

server.post('/data', function(request, response){
	console.log("DATA");
	logRequest(request);
	if(request.body.user != null) {
		if(typeof(request.body.day) != 'undefined' && typeof(request.body.month) != 'undefined' &&
			typeof(request.body.year) != 'undefined') {
			app.drinksOnDay(request.body.user, request.body.day, request.body.month, request.body.year, function(drinks){
				var back = {};
				if(typeof(drinks != 'undefined')) {
					back.success = true;
					back.result = drinks;
					back.response = "";
				} else {
					back.success = false;
					back.response = "server problem getting total drinks";
				}
				response.json(back);
			});
		} else {
			app.drinksAll(request.body.user, function(drinks){
				var back = {};
				if(typeof(drinks != 'undefined')) {
					back.success = true;
					back.result = drinks;
					back.response = "";
				} else {
					back.success = false;
					back.response = "server problem getting drinks";
				}
				response.json(back);
			});
		}
	} else {
		response.json({"success" : false, "response" : "please log in"});
	}
});

function logRequest(request) {
	console.log("-----------REQUEST MADE-----------");
	console.log("-----------PARAMETERS-------------");
	console.log(request.body);
	console.log("----------------------------------");
}

server.listen(1337, "0.0.0.0");
console.log("running on port 1337....");

/*
var regtest = {
	"username" : "user2",
	"password" : "pass2"
};

var logtest = {
	"username" : "user3",
	"password" : "pass3"
};

var drtest = {
	"username" : "userr2",
	"drink" : {
		"size" : "8",
		"time" : "4"
	}
};


if(regtest.password != null){
	regtest.password = app.makeHash(regtest);
}
app.addUser(regtest, function(back){
	console.log(back);
});


if(logtest.password != null){
	logtest.password = app.makeHash(logtest);
}
app.verifyPass(logtest, function(data){
	console.log(data);
});



if(drtest.username != null) {
	app.addDrink(drtest, function(back){
		console.log(back);
	});
} else {
	console.log({"success" : false, "response" : "please log in"});
}

*/