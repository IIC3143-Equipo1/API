var express = require('express');
var app = express();
var models = require('./models');
var bodyParser = require('body-parser');
var survey = require("./routes/survey");
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var csrf = require('csurf');

var api_prefix = '/api'

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
    secret: '5h4r1ng15C4r1ng'
}));
app.use(cookieParser('secret'));
app.use(csrf());
app.use(function (req, res, next) {
    res.cookie("XSRF-TOKEN",req.csrfToken());
    return next();
});

// survey routes
app.get(api_prefix + '/survey',        survey.allSurveys);
app.post(api_prefix + '/survey', 	   survey.createSurvey);
app.get(api_prefix + '/survey/:id',    survey.getSurvey);
app.put(api_prefix + '/survey/:id',    survey.updateSurvey);
app.delete(api_prefix + '/survey/:id', survey.deleteSurvey);

models.sequelize.sync().then(function () {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
});
