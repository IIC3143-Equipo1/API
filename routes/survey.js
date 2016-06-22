var models = require('../models');

exports.createSurvey = function(req, res) {
  models.Survey.create({
    name:      req.body.name,
    id_course: req.body.id_course,
    kw_areas:  req.body.kw_areas,
    id_user:   req.body.id_user || 1
  }).then(function(survey) {
    res.json(survey);
  });
};

// get all surveys
exports.allSurveys = function(req, res) {
  var page = (req.query.page * 5) - 5;
  models.Survey.findAndCountAll({
    where:{
      id_user: req.user.id
    },  
    order: 'id ASC',
    limit: 5,
    offset: page || 0
  }).then(function(surveys) {
      surveys.current_page = parseInt(req.query.page,10);
      res.json(surveys);
  });
};

// count all surveys
exports.countAllSurveis = function(req, res) {
  models.Survey.findAndCountAll({
    where:{
      id_user: req.user.id
    },  
  }).then(function(surveys) {
      res.json(surveys.count);
  });
};

// get single survey
exports.getSurvey = function(req, res) {
  models.Survey.find({
    where: {
      id: req.params.id
    }
  }).then(function(survey) {
    res.json(survey);
  });
};

// delete a single survey
exports.deleteSurvey = function(req, res) {
  models.Survey.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(survey) {
    res.json(survey);
  });
};

// update single survey
exports.updateSurvey = function(req, res) {
  models.Survey.find({
    where: {
      id: req.params.id
    }
  }).then(function(survey) {
    if(survey){
      survey.updateAttributes({
        name:      req.body.name,
        id_course: req.body.id_course,
        kw_areas:  req.body.kw_areas,
        id_user:   req.body.id_user || 1
      }).then(function(survey) {
        res.send(survey);
      });
    }
  });
};

exports.chartSurveis = function(req, res)
{

   models.Survey.findAll({
      attributes: ['name','id'],
      include: [{
      model: models.Answer,
      attributes:  ['id','was_answered'],
    },{
      model: models.Course,
      attributes: ['name'],
      include: [
        {
          model: models.StudentCourse,
          attributes:['StudentId']
        }],
      }],
    order: 'id ASC'
  }).then(function(surveys) {
     var keys = Object.keys( surveys );
     var response = [];
     for( var i = 0,length = keys.length; i < length; i++ ) {
         var survey = surveys[keys[i]].dataValues;
         var obj = new Object();
         obj.position = i;
         obj.data = [];
         obj.info = new Object();
         obj.info.survey    = survey.name;
         obj.info.survey_id = survey.id;
         var keys_answers   = Object.keys( survey.Answers );
         var length_answers = keys_answers.length;
         var count_was_answered     = 0;
         var count_was_not_answered = 0;
         for( var j = 0; j < length_answers; j++ ) {
            var answer = survey.Answers[j].dataValues;
            if(answer.was_answered)
            {
              count_was_answered =+ 1;
            }else
            {
              count_was_not_answered =+ 1;
            }
         }
         var students_count = survey.Course.StudentCourses.length;
         obj.data.push(count_was_answered);
         obj.data.push(count_was_not_answered);
         obj.data.push(students_count - length_answers);
         obj.info.course = survey.Course.name;
         response.push(obj);
     }
      res.json(response);
  });

};
