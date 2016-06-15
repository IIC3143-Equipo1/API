var models = require('../models');

exports.createSurvey = function(req, res) {
  console.log(req.body);
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
