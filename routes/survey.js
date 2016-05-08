var models = require('../models');

exports.createSurvey = function(req, res) {
  models.Survey.create({
    name: req.body.name,
    id_course: req.body.id_course
  }).then(function(survey) {
    res.json(survey);
  });
};

// get all surveys
exports.allSurveys = function(req, res) {
  var page = (req.query.page * 5) - 5;
  models.Survey.findAndCountAll({
    order: 'id ASC',
    limit: 5,
    offset: page || 0
    //attributes: { include: [[models.sequelize.fn('COUNT', models.sequelize.col('id')), 'total']] },
    //group: [models.sequelize.col('id')]
  }).then(function(surveys) {
      surveys.current_page = parseInt(req.query.page,10);
      res.json(surveys);
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
        name: req.body.name,
      }).then(function(survey) {
        res.send(survey);
      });
    }
  });
};
