var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var survey = require("./routes/survey");

var api_prefix = '/api'

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({
  extended: true
}));

// survey routes
app.get(api_prefix + '/survey',        survey.allSurveys);
app.post(api_prefix + '/survey', 	   survey.createSurvey);
app.get(api_prefix + '/survey/:id',    survey.getSurvey);
app.put(api_prefix + '/survey/:id',    survey.updateSurvey);
app.delete(api_prefix + '/survey/:id', survey.deleteSurvey);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
