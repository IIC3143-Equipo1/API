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
			var user = req.user;
			if(user && user.password){ user.password = ''; }
			res.send(req.isAuthenticated() ? user : '0'); 
		});
		
		/* Handle Login POST */
		router.post('/login', passport.authenticate('login', {
			successRedirect: process.env.API_URL + '/success',
			failureRedirect: process.env.API_URL + '/fail',
			failureFlash : true  
		}));

		/* Handle launch POST */
		router.post('/launch', function(req,res,next)
		{
			//secret dijq5mojyt
			//if(req.body.oauth_consumer_key == 'juqhxih203h7cezgw7yuongo')
			//{
				passport.authenticate('launch',function(err,user,info)
				{ 
					if (err) { return next(err); }
				    if (!user) { return res.redirect(process.env.ORIGIN_URL+'/#/register'); }
				    req.logIn(user, function(err) {
				      if (err) { return next(err); }
				      return res.redirect(process.env.ORIGIN_URL+'/#/home');
				    });
				})(req, res, next);
			//}else
			//{
			//	return res.redirect(process.env.ORIGIN_URL+'/#/login');
			//}
		});

		/* Error signup */
		router.get('/signup', function(req, res){
			res.render('register',{ message: req.flash('message') });
		});

		/* Handle Registration POST */
		router.post('/signup', passport.authenticate('signup', {
			successRedirect: process.env.API_URL + '/success',
			failureRedirect: process.env.API_URL + '/signup',
			failureFlash : true  
		}));

		/* Login and signup response */
		router.get('/success', isAuthenticated, function(req, res){
			var user = req.user;
			if(user && user.password){ user.password = ''; }
			return res.status(200).json({
				user: user,
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
