var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost/test';


mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');

//保存登录状态 session
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

if ('development' ===app.get('env')) { //获取环境变量
    var logger = require('morgan')
    app.set('showStackError', true)
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug', true)
}

app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

require('./config/routes')(app)

console.log('imooc started on port ' + port);




