var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const upload = require('express-fileupload');
const fs = require('fs');


const session = require('express-session');
//Almacenar la sesion en nuestra base de datos
const MongoStore = require('connect-mongo')(session);
//Credenciales de nuestra base de datos
const {mongodb}=require('./configs/keys');



//mongoose.connect('mongodb://localhost:27017/UcaCloud', { useNewUrlParser: true })
// var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var dir = __dirname + '/public/upload';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0744);
}

var app = express();
require('./configs/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
    secret:"Hello World!!!",
    resave: true, // para alamcenar el objeto session
    saveUninitialized: true, // inicializar si el objeto esta vacio
    //para almacenar la sesion en la base de datos
    store: new MongoStore({
        url: mongodb.URI,
        autoReconnect: true
    })
    }));
  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload());

// 
// app.use((req, res, next)=>{
//     res.locals.user = req.user || null;
//     next();
// })
app.use((req,res,next)=>{
    app.locals.session = req.session;
    next();
    });

app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);




    //routes
    app.use('/', loginRouter); // ruta para el index
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;