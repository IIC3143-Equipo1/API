var express = require('express');
var app = express();

var api_prefix = '/api/v1.0'

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
