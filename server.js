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
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '3v41u4t-3';
var api_prefix   = '/api'

app.set('port', process.env.PORT || 5001);

app.use(cors({credentials: true, origin: 'http://localhost:5000'}));
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

/*app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});*/

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
            .get(survey.getSurvey)
            .post(auth,survey.updateSurvey)
            .delete(auth,survey.deleteSurvey);

router.route(api_prefix + "/answer")
            .get(answer.allAnswers)
            .post(answer.createAnswer);

router.route(api_prefix + "/answer/:id")
            .delete(auth,answer.deleteAnswer)
            .get(answer.getAnswer);

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

router.route(api_prefix + '/answer_student_survey')  
            .get(answer.getAnswerStudentSurvey);                    


/************Crypto functions ************/
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
/*****************************************/

app.post(api_prefix + '/send_message', function(req,res){

  var encrypt_value = encrypt(req.body.student + '&-&' + req.body.survey);

  var html = '<html>'+
'<meta charset="utf-8" />'+ 
'<head></head>'+
'<body>'+
'<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">'+
    '<tr>'+
        '<td align="center" valign="top">'+
            '<table border="0" cellpadding="20" cellspacing="0" width="600" id="emailContainer">'+
                '<tr>'+
                    '<td align="center" valign="top">'+
                        '<table border="0" cellpadding="20" cellspacing="0" width="100%" id="emailHeader">'+
                            '<tr>'+
                                '<td align="center" style="background-color:#D8D8D8" valign="top">'+
                                    '<b>EVALUAT-E</b>, encuesta del curso'+
                                '</td>'+
                            '</tr>'+
                        '</table>'+
                    '</td>'+
                '</tr>'+
                '<tr>'+
                    '<td align="center" valign="top">'+
                        '<table border="0" cellpadding="20" cellspacing="0" width="100%" id="emailBody">'+
                            '<tr>'+
                                '<td align="center" valign="top">'+
                                    'Hola '+req.body.name+', tu opinión es valiosa para nosotros, por favor llena la encuesta que '+ 
                                    'encontraras a continuación en el siguiente enlace:<br \>'+
                                    '<a href="http://localhost:5000/#/answer_form/'+encrypt_value+'">'+
                                    '<div style="background-color:#f2583e;color:white;padding:10px;font-size:14pt;font-weight:bold;'+
                                    'text-align:center;margin:10px;display:inline-block">Encuesta</div>'+
                                    '</a>'+
                                '</td>'+
                            '</tr>'+
                        '</table>'+
                    '</td>'+
                '</tr>'+
                '<tr>'+
                    '<td align="center" valign="top">'+
                        '<table border="0" cellpadding="20" cellspacing="0" width="100%" id="emailFooter">'+
                            '<tr>'+
                                '<td align="center" style="background-color:#0B3861;color:white" valign="top">'+
                                    'Santiago de Chile, 2016'+
                                '</td>'+
                            '</tr>'+
                        '</table>'+
                    '</td>'+
                '</tr>'+
            '</table>'+
        '</td>'+
    '</tr>'+
'</table>'+
'</body>'+
'</html>';

  sendgrid.send({
         to:  req.body.email,
       from:  'jddiaz4@uc.cl',
    subject:  'Encuesta curso 4 elemental',
       html:  html
  }, function(err, json) {
    if (err) { 
      console.log(err);
      res.json(err);
    }else
    {
     res.json(json);
    }
  });
});

app.post(api_prefix + '/decrypt', function(req,res){
  var decrypt_value = decrypt(req.body.text);
  res.json(decrypt_value);
});


app.use("/" , router);

// sync models and run server
models.sequelize.sync().then(function () {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
});
