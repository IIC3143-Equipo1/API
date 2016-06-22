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

exports.chartCourses = function(req, res)
{
   models.Course.findAll({
      attributes: ['name'],
      include: [{
      model: models.Survey,
      attributes: ['name'],
      include: [
        {
          model: models.Answer,
          attributes:['was_answered']
        }],
      }],
    order: 'id ASC'
  }).then(function(courses) {

var keys = Object.keys( courses );
     var response = [];
     for( var i = 0,length = keys.length; i < length; i++ ) {
         var course = courses[keys[i]].dataValues;
         var obj = new Object();
         obj.position = i;
         obj.name = course.name;
         obj.data = [];
         obj.data[0] = [];
         obj.data[1] = [];
         obj.info = [];
         var keys_surveis   = Object.keys( course.Surveys );
         var length_surveis = keys_surveis.length;
         for( var j = 0; j < length_surveis; j++ ) {
            var survey = course.Surveys[j].dataValues;
            obj.info.push(survey.name);
            var keys_answers   = Object.keys( survey.Answers );
            var length_answers = keys_answers.length;
            var count_was_answered     = 0;
            var count_was_not_answered = 0;
            for( var k = 0; k < length_answers; k++ ) {
              var answer = survey.Answers[k].dataValues;
              if(answer.was_answered)
              {
                count_was_answered =+ 1;
              }else
              {
                count_was_not_answered =+ 1;
              }
            }
            obj.data[0].push(count_was_answered);
            obj.data[1].push(count_was_not_answered);
         }
         response.push(obj);
     }
      res.json(response);
  });

};

