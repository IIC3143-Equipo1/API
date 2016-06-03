  var models = require('../models');

exports.createAnswer = function(req, res) {
  models.Answer.create({
    id_survey: req.body.id_survey,
    id_student: req.body.id_student,
    kw_answers: req.body.kw_answers
  }).then(function(answer) {
    res.json(answer);
  });
};

// get all answers for a certain question
exports.getSurveyAnswers = function(req,res) {
  console.log("Se ha llegado a la funcion para obtener las respuestas para la encuesta", req.params.id);
  models.Answer.findAndCountAll({
    include: [models.Student,models.Survey],
    where: {
      id_survey: req.params.id
    }
  }).then(function(answers){
    res.json(answers);
  });
}

// get answer by student and survey
exports.getAnswerStudentSurvey = function(req,res) {
  models.Answer.find({
    include: [models.Student,models.Survey],
    where: {
      id_survey: req.query.id_survey,
      id_student: req.query.id_student
    }
  }).then(function(answers){
    res.json(answers);
  });
}

// get all answers
exports.allAnswers = function(req, res) {
  var page = (req.query.page * 5) - 5;
  models.Answer.findAndCountAll({
    //include: [models.Student,models.Survey],
    order: 'id ASC',
    limit: 5,
    offset: page || 0,
    include: [{
      model: models.Survey,
      where: { id_user: req.user.id }
    },{
      model: models.Student
    }]
  }).then(function(answers) {
      answers.current_page = parseInt(req.query.page,10);
      res.json(answers);
  });
};

// get single answer
exports.getAnswer = function(req, res) {
  models.Answer.find({
    include: [models.Student,models.Survey],
    where: {
      id: req.params.id
    }
  }).then(function(answer) {
    res.json(answer);
  });
};

// delete a single answer
exports.deleteAnswer = function(req, res) {
  models.Answer.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(answer) {
    res.json(answer);
  });
};

// update single answer
exports.updateAnswer = function(req, res) {
  models.Answer.find({
    where: {
      id: req.params.id
    }
  }).then(function(answer) {
    if(answer){
      answer.updateAttributes({
        id_survey: req.body.id_survey,
        id_student: req.body.id_student,
        kw_answers: req.body.kw_areas
      }).then(function(answer) {
        res.send(answer);
      });
    }
  });
};
