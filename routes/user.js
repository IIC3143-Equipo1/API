var models = require('../models');
var bCrypt = require('bcrypt-nodejs');

exports.createUser = function(req, res) {
  models.User.create({
     username: req.body.username,
     password: createHash(req.body.password),
        email: req.body.email,
    firstName: req.body.firstName,
     lastName: req.body.lastName
  }).then(function(user) {
    user.password = '';
    res.json(user);
  });
};

// get all users
exports.allUsers = function(req, res) {
  var page = (req.query.page * 5) - 5;
  models.User.findAndCountAll({
    attributes: {
      exclude: ['password']
    },
    order: 'id ASC',
    limit: 5,
    offset: page || 0
  }).then(function(users) {
      users.current_page = parseInt(req.query.page,10);
      res.json(users);
  });
};

// get single user
exports.getUser = function(req, res) {
  models.User.find({
    where: {
      id: req.params.id
    },
    attributes: {
      exclude: ['password']
    }
  }).then(function(user) {
    res.json(user);
  });
};


// delete a single user
exports.deleteUser = function(req, res) {
  models.User.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(user) {
    res.json(user);
  });
};

// update single user
exports.updateUser = function(req, res) {
  models.User.find({
    where: {
      id: req.params.id
    },
    attributes: {
      exclude: ['password']
    }
  }).then(function(user) {
    if(user){
      user.updateAttributes({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password:createHash(req.body.password)
      }).then(function(user) {
        res.send(user);
      });
    }
  });
};

  // Generates hash using bCrypt
  var createHash = function(password){
      return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }
