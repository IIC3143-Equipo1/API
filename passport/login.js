var LocalStrategy = require('passport-local').Strategy;
var models        = require('../models');
var bCrypt        = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            console.log(req.body);
            // check in mongo if a user with username exists or not
            models.User.findOne({where: { username :  username }}).then( 
                function(user) {
                    //console.log(user.password);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                  
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    return done(null, user);                      
                },
                function(error)
                {
                    console.log(error);
                    // In case of any error, return using the done method
                    if (error)
                        return done(error);
                }
            );

        })
    );

    passport.use('launch', new LocalStrategy({
            passReqToCallback : true,
            usernameField: 'lis_person_contact_email_primary',
            passwordField: 'user_id'
        },
        function(req, email, password, done) { 
            console.log(req.body);
            // check in mongo if a user with username exists or not
            models.User.findOne({where: { email :  email }}).then( 
                function(user) {
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                  
                    }
                    return done(null, user);                      
                },
                function(error)
                {
                    console.log(error);
                    // In case of any error, return using the done method
                    if (error)
                        return done(error);
                }
            );

        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }
    
}