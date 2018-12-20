var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');

var router = require('./routes/users');
var indexrouter = require('./routes/route');
var forumrouter = require('./routes/forum');
var indxrouter = require('./routes/index');
var filterrouter =require('/routes/filter');


var app = express();

//connect to mongodb
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/schoolingcouncil_developeronrent')
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

  

//adding middleware -cors
app.use(cors({
    origin:['http://localhost:4200'],
    credentials:true
}));

app.use(logger('dev'));
app.use(express.json());
//parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//static files
app.use(express.static(path.join(__dirname, 'public')));

//passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users',router);
app.use('/api',indexrouter);
app.use('/forum',forumrouter);
app.use('/api',indxrouter);
app.use('/filter',filterrouter);


//catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

//error handler
app.use(function (err, req, res, next) {
    //set locals, only providing error in developement
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //render the error page
    res.status(err.status || 500);
    res.render('error');

});

module.exports = app;