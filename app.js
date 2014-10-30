var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var course = require('./routes/course');
var tag = require('./routes/tag');
var random = require('./routes/random');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views-jade'));
app.set('view engine', 'jade');
//app.engine('jade', require('jade').__express);

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'mustache');
//app.engine('mustache', require('hogan-middleware').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist/')));

app.use('/', routes);
app.use('/users', users);
app.use('/course', course);
app.use('/tag', tag);
app.use('/random', random);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
