var express = require('express');
var app = express();
var models = require('./models');
var bodyParser = require('body-parser');
var survey = require("./routes/survey");
var answer = require("./routes/answer");
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var csrf = require('csurf');
var cors = require('cors');

var api_prefix = '/api'

app.set('port', process.env.PORT || 5000);

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
            .put(survey.updateSurvey)
            .delete(survey.deleteSurvey);

router.route(api_prefix + "/answer")
      .get(answer.allAnswers)
      .post(answer.createAnswer);

router.route(api_prefix + "/answer/:id")
      .delete(answer.deleteAnswer);

surveyAnswerRouter.route('/answers')
                  .get(answer.getSurveyAnswers);

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
