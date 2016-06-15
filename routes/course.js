var models = require('../models');

exports.createCourse = function(req, res) {
  models.Course.create({
    name:    req.body.name,
    code:    req.body.code,
    id_user: req.body.id_user || 1
  }).then(function(course) {
    res.json(course);
  });
};

// get all courses
exports.allCourses = function(req, res) {
  var page = (req.query.page * 5) - 5;
  models.Course.findAndCountAll({
    order: 'id ASC',
    limit: 5,
    offset: page || 0
  }).then(function(courses) {
      courses.current_page = parseInt(req.query.page,10);
      res.json(courses);
  });
};

// get single course
exports.getCourse = function(req, res) {
  models.Course.find({
    where: {
      id: req.params.id
    }
  }).then(function(course) {
    res.json(course);
  });
};

// delete a single course
exports.deleteCourse = function(req, res) {
  models.Course.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(course) {
    res.json(course);
  });
};

// update single course
exports.updateCourse = function(req, res) {
  models.Course.find({
    where: {
      id: req.params.id
    }
  }).then(function(course) {
    if(course){
      course.updateAttributes({
        name:    req.body.name,
        code:    req.body.code,
        id_user: req.body.id_user || 1
      }).then(function(course) {
        res.send(course);
      });
    }
  });
};
