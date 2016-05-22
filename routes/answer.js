  var models = require('../models');

exports.createAnswer = function(req, res) {
  models.Answer.create({
    survey_id: req.body.survey_id,
    kw_answers: req.body.kw_answers
  }).then(function(answer) {
    res.json(answer);
  });
};

// get all answerts for a certain question
exports.getSurveyAnswers = function(req,res) {
  console.log("Se ha llegado a la funcion para obtener las respuestas para la encuesta", req.params.id);
  models.Answer.findAndCountAll({
    where: {
      survey_id: req.params.id
    }
  }).then(function(answers){
    res.json(answers);
  });
}

// get all answers
exports.allAnswers = function(req, res) {
  var page = (req.query.page * 5) - 5;
  models.Answer.findAndCountAll({
    order: 'id ASC',
    limit: 5,
    offset: page || 0
  }).then(function(answers) {
      answers.current_page = parseInt(req.query.page,10);
      res.json(answers);
  });
};

// get single answer
exports.getAnswer = function(req, res) {
  models.Answer.find({
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
        survey_id: req.body.survey_id,
        kw_answers: req.body.kw_areas
      }).then(function(answer) {
        res.send(answer);
      });
    }
  });
};
