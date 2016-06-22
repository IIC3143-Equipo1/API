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
    where:{
      was_answered:true
    },
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

// count all answers
exports.countAllAnswers = function(req, res) {
  models.Answer.findAndCountAll({
    where:{
      was_open: false,    
    },
    include: [{
      model: models.Survey,
      where: { id_user: req.user.id }
    }]
  }).then(function(answers) {
      res.json(answers.count);
  });
};

// set the answer open
exports.setAnswerOpen = function(req, res) {
  models.Answer.find({
    where: {
      id: req.query.id
    }
  }).then(function(answer) {
    if(answer){
      answer.updateAttributes({
        was_open: true
      }).then(function(answer) {
        res.send(answer);
      });
    }
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
        id_survey: (!req.body.id_survey)?answer.id_survey:req.body.id_survey,
        id_student: (!req.body.id_student)?answer.id_student:req.body.id_student,
        kw_answers: (!req.body.kw_answers)?answer.kw_answers:req.body.kw_answers,
        was_answered: (!req.body.was_answered)?answer.was_answered:req.body.was_answered,
        feedback: (!req.body.feedback)?answer.feedback:req.body.feedback
      }).then(function(answer) {
        res.send(answer);
      });
    }
  });
};

exports.chartAnswers = function(req, res)
{
   models.Answer.findAll({
      where:{ id_survey: req.body.id_survey},
      include:[{
        model: models.Survey
      }],
      order: 'id ASC'
  }).then(function(answers) {

     var q_titles = new Object();
     if(answers.length > 0)
     {
      var kws = answers[0].Survey.kw_areas;
      if(kws)
      {
        var length_kw = kws.length;
        if(length_kw > 0)
        {
          for(t=0;t < length_kw; t++)
          {
              var question = kws[t].questions;
              for(h=0; h < question.length; h++)
              {
                  q_titles[question[h].position] = question[h].text;
              }
          }
        }
      }
     }

     var keys = Object.keys( answers );
     var response = [];
     for( var i = 0; i < keys.length; i++ ) {
         var answer = answers[keys[i]].dataValues;
         if(answer.kw_answers)
         {
         var kw_answer = answer.kw_answers[0];
         var keys_questions   = Object.keys( kw_answer.questions);
         var length_questions = keys_questions.length;
         var q = new Object();
         for( var j = 0; j < length_questions; j++ ) {
            var question = kw_answer.questions[j];
            if(question.type == 2)
            {
              if(!q[question.position])
              {
                q[question.position] = new Object();
                q[question.position].values = new Object();
              }
              if(q[question.position]['values'][question.answer] == null){ q[question.position]['values'][question.answer] = 0;}
              q[question.position]['values'][question.answer] = q[question.position]['values'][question.answer] + 1;
            }
            if(question.type == 3)
            {
              if(!q[question.position])
              {
                q[question.position] = new Object();
                q[question.position].values = new Object();
              }
               for( var k = 0; k < question.answer.length; k++ ) {
                  if(q[question.position]['values'][question.answer[k]] == null){ q[question.position]['values'][question.answer[k]] = 0;}
                  q[question.position]['values'][question.answer[k]] = q[question.position]['values'][question.answer[k]] + 1;
                }  
            }
         }
         response.push(q);
        }
      }
      res.json({data:response,questions:q_titles});
  });

};
