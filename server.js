var express = require('express');
var app = express();
var models = require('./models');
var bodyParser = require('body-parser');
var survey = require("./routes/survey");
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var csrf = require('csurf');
var cors = require('cors');

var api_prefix = '/api'

app.set('port', process.env.PORT || 5000);

// enable cross origin request
// source: https://github.com/expressjs/cors
app.use(cors());

// parse urlconded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

// -------------
// survey routes
app.get(api_prefix + '/survey',        survey.allSurveys);
app.post(api_prefix + '/survey', 	   survey.createSurvey);
app.get(api_prefix + '/survey/:id',    survey.getSurvey);
app.put(api_prefix + '/survey/:id',    survey.updateSurvey);
app.delete(api_prefix + '/survey/:id', survey.deleteSurvey);

// sync models and run server
models.sequelize.sync().then(function () {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
});
