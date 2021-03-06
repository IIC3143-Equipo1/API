var express      = require('express');
var app          = express();
var models       = require('./models');
var bodyParser   = require('body-parser');
var survey       = require("./routes/survey");
var answer       = require("./routes/answer");
var course       = require("./routes/course");
var student      = require("./routes/student");
var user         = require("./routes/user");
var cookieParser = require('cookie-parser');
var cors         = require('cors');
var env          = require('node-env-file');
env(__dirname + '/.env');
var sendgrid   = require('sendgrid')(process.env.SENDGRID_KEY);
var crypto     = require('crypto'),
    algorithm  = 'aes-256-ctr',
    password   = process.env.PASS_CRYPTO;
var api_prefix = process.env.API_URL + process.env.API_PREFIX;

app.set('port', process.env.PORT || 5001);

app.use(cors({credentials: true, origin: process.env.ORIGIN_URL}));
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
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie : { 
      secure : false
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var p_routes = require('./routes/passport');
var routes   = p_routes.passport(passport);
var auth     = p_routes.isAuthenticated;
app.use(process.env.API_URL, routes);

var router  = express.Router();
var surveyAnswerRouter = express.Router({mergeParams:true});
router.use(api_prefix + '/survey/:id', surveyAnswerRouter);

//survey routes
router.route(api_prefix + '/survey')
            .get(survey.allSurveys)
            .post(auth,survey.createSurvey);

router.route(api_prefix + '/survey/:id')
            .get(survey.getSurvey)
            .post(auth,survey.updateSurvey)
            .delete(auth,survey.deleteSurvey);

router.route(api_prefix + "/answer")
            .get(answer.allAnswers)
            .post(auth,answer.createAnswer);


router.route(api_prefix + "/answer/:id")
            .put(answer.updateAnswer)
            .delete(auth,answer.deleteAnswer)
            .get(answer.getAnswer);

surveyAnswerRouter.route('/answers')
            .get(auth,answer.getSurveyAnswers);

router.route(api_prefix + '/course')
            .get(course.allCourses)
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

//user routes
router.route(api_prefix + '/user')
            .get(user.allUsers)
            .post(user.createUser);

router.route(api_prefix + '/user/:id')
            .get(user.getUser)
            .post(auth,user.updateUser)
            .delete(auth,user.deleteUser);

/**************** CUSTOM ROUTES ********************/
router.route(api_prefix + '/answer_student_survey')  
            .get(answer.getAnswerStudentSurvey); 

router.route(api_prefix + '/count_all_surveis')  
            .get(survey.countAllSurveis);  

router.route(api_prefix + '/set_answer_open')  
            .get(answer.setAnswerOpen);

router.route(api_prefix + '/count_answers_not_open')  
            .get(answer.countAllAnswers);  
/***************************************************/  

/**************** CHARTS *******************/

router.route(api_prefix + '/chart_surveis')  
            .post(survey.chartSurveis); 

router.route(api_prefix + '/chart_courses')  
            .post(course.chartCourses); 

router.route(api_prefix + '/chart_answers')  
            .post(answer.chartAnswers); 

/*******************************************/          


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
                                    '<a href="'+process.env.ORIGIN_URL+'/#/answer_form/'+encrypt_value+'">'+
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
       from:  process.env.SENDER_EMAIL,
    subject:  'Encuesta curso',
       html:  html
  }, function(err, json) {
    if (err) { 
      console.log(err);
      res.status(500).json({error:'Hubo un error en el envío, por favor intenta de nuevo, '+
        'de persistir el error por favor contacta al administrador de la aplicación','full':err});
    }else
    {

    models.Answer.create({
      id_survey:  req.body.survey,
      id_student: req.body.student
    }).then(function(answer) {
      //OK
    });
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
