var express      = require('express');
var app          = express();
var models       = require('./models');
var bodyParser   = require('body-parser');
var survey       = require("./routes/survey");
var answer       = require("./routes/answer");
var course       = require("./routes/course");
var student      = require("./routes/student");
var cookieParser = require('cookie-parser');
var cors         = require('cors');
var sendgrid     = require('sendgrid')('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');
var api_prefix   = '/api'

app.set('port', process.env.PORT || 5001);

app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

var flash = require('connect-flash');
app.use(flash());
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({
    secret: 'mySecretKey',
    saveUninitialized: true,
    resave: true,
    cookie : { 
      secure : false
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var p_routes = require('./routes/passport');
var routes   = p_routes.passport(passport);
var auth     = p_routes.isAuthenticated;
app.use('/', routes);

var router  = express.Router();
var surveyAnswerRouter = express.Router({mergeParams: true});
router.use(api_prefix + '/survey/:id', surveyAnswerRouter);

//survey routes
router.route(api_prefix + '/survey')
            .get(auth,survey.allSurveys)
            .post(auth,survey.createSurvey);

router.route(api_prefix + '/survey/:id')
            .get(auth,survey.getSurvey)
            .post(auth,survey.updateSurvey)
            .delete(auth,survey.deleteSurvey);

router.route(api_prefix + "/answer")
            .get(auth,answer.allAnswers)
            .post(auth,answer.createAnswer);

router.route(api_prefix + "/answer/:id")
            .delete(auth,answer.deleteAnswer);

surveyAnswerRouter.route('/answers')
            .get(auth,answer.getSurveyAnswers);

router.route(api_prefix + '/course')
            .get(auth,course.allCourses)
            .post(auth,course.createCourse);

router.route(api_prefix + '/course/:id')
            .get(auth,course.getCourse)
            .put(auth,course.updateCourse)
            .delete(auth,course.deleteCourse);   

router.route(api_prefix + '/student')
            .get(auth,student.allStudents)
            .post(auth,student.createStudent);

router.route(api_prefix + '/student/:id')
            .get(auth,student.getStudent)
            .put(auth,student.updateStudent)
            .delete(auth,student.deleteStudent);     

router.route(api_prefix + '/student_course')  
            .get(auth,student.getStudentsByCourse)
            .post(auth,student.saveStudentCourse)
            .delete(auth,student.deleteStudentCourse);                      


app.post(api_prefix + '/send_message',auth, function(req,res){
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

app.use("/" , router);

// sync models and run server
models.sequelize.sync().then(function () {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
});
