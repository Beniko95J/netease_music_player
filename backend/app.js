var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);

var indexRouter = require('./routes/index');
var logonRouter = require('./routes/logon');
var loginRouter = require('./routes/login');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new redisStore({client: redis.createClient(6379, '127.0.0.1')}),
  secret: 'bs5gGRAL',
  resave: false,
  saveUninitialized: false,
  name: 'session_id'
}))

app.use('/', indexRouter);
app.use('/', logonRouter);
app.use('/', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('handling error...');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

app.listen(3000, () => {
  console.log('Hello, express!');
})
module.exports = app;
