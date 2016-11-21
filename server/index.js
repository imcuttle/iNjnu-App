var express = require('express');
var jwt = require('jsonwebtoken');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var path = require('path')
var protect = require('./protect');
var api = require('./api');
process.env.PORT = process.env.PORT || 9669

var http = require('http').createServer(app).listen(process.env.PORT, () => {
	console.log("server run on Port %d.", http.address().port);
});

app.use('/users', express.static(__dirname + '/users'))
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.raw({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit:'5mb'}));

app.use(logger('dev'));

app.use((req, res, next) => {
	res.header('Access-Control-Origin', '*')
	res.header('Access-Control-Methods', 'PUT,POST,GET')
	res.header('Content-Type', "application/json;charset=utf-8")
	next();
})

app.all('/', (req, res, next) => {
	res.end('app ok!');
})


app.use('/api', api);

app.use('/protect', protect);

module.exports = app
