const createError = require('http-errors');
const express = require('express');
const { join } = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const logger = require('morgan');

// MongoDB will be DB of choice
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const pingRouter = require('./routes/ping');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const currentUserRouter = require('./routes/current-user');

const { json, urlencoded } = express;

var app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({ signed: false }));
app.use(express.static(join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ping', pingRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/currentuser', currentUserRouter);

// ensure environment variables are defined
// attempt a connection to mongodb
const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY environment variable must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Successfully connect to DB');
  } catch (err) {
    console.log(err);
  }
};

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
  res.json({ error: err });
});

startUp();

module.exports = app;
