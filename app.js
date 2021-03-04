var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//router
var index = require('./routes/index');

var app = express();

// CORS
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    //header("Content-Type", "application/json;charset=utf-8");
    next();
});

//设置icon图标
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/static/favicon.ico'));

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json({"limit":"9000000kb"}));
app.use(bodyParser.urlencoded({ extended: false,"limit":"9000000kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*======测试=========*/
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});
/*======测试=========*/


app.use('/', express.static(path.join(__dirname, 'build')));
app.use('/static', express.static(path.join(__dirname, 'build/static')));
app.use('/chunks', express.static(path.join(__dirname, 'build/chunks')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log('错误处理模块');
    if (err.name === 'UnauthorizedError') {
        console.log('Invalid token');
        res.status(401).send('invalid token...');
    }
    if(err == "JsonWebTokenError: invalid token"){
        console.log("Error Catch: Invalid token!");
        var result = {
            status:2,
            description:'jwt错误,请重新登陆',
            result:{
            }
        };

        res.json(result);
        res.end();
    }

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8601, function(){
  console.log("服务已经启动");
});
