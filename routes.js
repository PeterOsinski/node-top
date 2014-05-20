
var defaultController = require('./controller/default.js');
var express = require('express');
var auth = express.basicAuth(function(user, pass) {     
   return (user == "pi" && pass == "adminadminadmin");
},'secret');

var secure = function(req, res, next){
	if (req.session.user) {
	    next();
	  } else {
	    req.session.error = 'Access denied!';
	    res.redirect('/login');
	  }
}

module.exports = function(app){

	app.get('/', auth, defaultController.index);
	app.all('/endpoint', defaultController.endpoint);

}

