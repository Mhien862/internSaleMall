var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import configDB from './config/configDB'
var cors = require('cors');
import configRedis from './config/configRedis'

// var indexRouter = require('./routes/index');
// var userRouter = require('./routes/Users');
// var authRouter = require('./routes/Auth');
import indexRoute from './routes/index'

var app = express();

//cors
let whitelist = ['http://localhost:5173', 'http://127.0.0.1:5173'];
let corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, credentials: true
}
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

configDB.connectDB()
// configRedis()

// app.use('/', indexRouter);
// app.use('/users', userRouter);
// app.use('/auth', authRouter);
indexRoute(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;