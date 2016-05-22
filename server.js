var express = require('express');
var app = express();
var models = require('./models');
var bodyParser = require('body-parser');
var survey = require("./routes/survey");
var answer = require("./routes/answer");
var course = require("./routes/course");
var student = require("./routes/student");
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var csrf = require('csurf');
var cors = require('cors');
var sendgrid  = require('sendgrid')('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');

var api_prefix = '/api'

app.set('port', process.env.PORT || 5001);

// enable cross origin request
// source: https://github.com/expressjs/cors
app.use(cors());

app.use(bodyParser.json()); 
// parse urlconded bodies
app.use(bodyParser.urlencoded({
  extended: false
}));

var router  = express.Router();
var surveyAnswerRouter = express.Router({mergeParams: true});
router.use(api_prefix + '/survey/:id', surveyAnswerRouter);
// -------------
// survey routes

router.route(api_prefix + '/survey')
            .get(survey.allSurveys)
            .post(survey.createSurvey);

router.route(api_prefix + '/survey/:id')
            .get(survey.getSurvey)
            .post(survey.updateSurvey)
            .delete(survey.deleteSurvey);

router.route(api_prefix + "/answer")
      .get(answer.allAnswers)
      .post(answer.createAnswer);

router.route(api_prefix + "/answer/:id")
      .delete(answer.deleteAnswer);

surveyAnswerRouter.route('/answers')
                  .get(answer.getSurveyAnswers);

router.route(api_prefix + '/course')
            .get(course.allCourses)
            .post(course.createCourse);

router.route(api_prefix + '/course/:id')
            .get(course.getCourse)
            .put(course.updateCourse)
            .delete(course.deleteCourse);   

router.route(api_prefix + '/student')
            .get(student.allStudents)
            .post(student.createStudent);

router.route(api_prefix + '/student/:id')
            .get(student.getStudent)
            .put(student.updateStudent)
            .delete(student.deleteStudent);     

router.route(api_prefix + '/student_aux/getStudentsByCourse')  
            .get(student.getStudentsByCourse);                     




app.post(api_prefix + '/send_message', function(req,res){
	sendgrid.send({
	  to:       req.body.email,
	  from:     'jddiaz4@uc.cl',
	  subject:  'Encuesta curso 4 elemental',
	  text:     req.body.name +', a continuación veras un link que te llevará a una encuesta en pro de obtener tu opinion acerca'+
	  ' del curso. <<Link aqui>>'
	}, function(err, json) {
	  if (err) { 
	  	res.json(err);
	  }
	  res.json(json);
	});
});

/*
app.get(api_prefix + '/survey',        survey.allSurveys);
app.post(api_prefix + '/survey', 	   survey.createSurvey);
app.get(api_prefix + '/survey/:id',    survey.getSurvey);
app.put(api_prefix + '/survey/:id',    survey.updateSurvey);
app.delete(api_prefix + '/survey/:id', survey.deleteSurvey);
*/

// answer routes
//app.get(api_prefix + '/answer',                   answer.allAnswers);
//app.post(api_prefix + '/answer',                  answer.createAnswer);


app.use("/" , router);


// sync models and run server
models.sequelize.sync().then(function () {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
});
