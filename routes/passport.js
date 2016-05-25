var express  = require('express');
var router   = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	return res.status(401).json({
    	err: 'Usuario no autorizado'
  	});
}

module.exports = {
	isAuthenticated: isAuthenticated,
	passport: function(passport){

		router.get('/fail', function(req, res) {
			return res.status(401).json({
	        	error: 'Usuario o contraseña invalida'
	      	});
		});

		/* Route to test if the user is logged in or not */
		router.get('/loggedin', function(req, res) { 
			res.send(req.isAuthenticated() ? req.user : '0'); 
		});
		
		/* Handle Login POST */
		router.post('/login', passport.authenticate('login', {
			successRedirect: '/success',
			failureRedirect: '/fail',
			failureFlash : true  
		}));

		/* GET Registration Page */
		router.get('/signup', function(req, res){
			res.render('register',{ message: req.flash('message') });
		});

		/* Handle Registration POST */
		router.post('/signup', passport.authenticate('signup', {
			successRedirect: '/success',
			failureRedirect: '/signup',
			failureFlash : true  
		}));

		/* GET Home Page */
		router.get('/success', isAuthenticated, function(req, res){
			return res.status(200).json({
	        	status: 'Registration successful!'
	      	});
		});

		/* Handle Logout */
		router.get('/signout', function(req, res) {
			req.logout();
			return res.status(200).json({
	        	status: 'Ok'
	      	});
		});

		return router;
	}
}