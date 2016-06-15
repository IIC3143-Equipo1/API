var LocalStrategy   = require('passport-local').Strategy;
var models          = require('../models');
var bCrypt          = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                models.User.findOne({where:{ 'username' :  username }}).then(function(user) {
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false,req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        models.User.create({
                             username: username,
                             password: createHash(password),
                                email: req.param('email'),
                            firstName: req.param('firstName'),
                             lastName: req.param('lastName')
                        }).then(function(user) {
                            console.log('User Registration succesful');    
                            return done(null, user);
                        },
                        function(error){
                            console.log('Error in Saving user: '+err);  
                            throw error; 
                        });

                    }
                },
                function(error){
                    // In case of any error, return using the done method
                    if (error){
                        console.log('Error in SignUp: '+error);
                        return done(error);
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}