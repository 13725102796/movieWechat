var User = require('../models/user');

//signin
exports.showSignin = function (req, res) {
    res.render('signin', {
        title: 'imooc 用户登录页'
    })
};

exports.showSignup = function (req, res) {
        res.render('signup', {
            title: 'imooc 用户注册页'
        })
};

//signup 注册的路由
exports.signup = function (req, res) {
    var _user = req.body.user;

    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            var user = new User(_user);

            user.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                console.log(user);
                res.redirect('/');
            })
        }
        else {
            res.redirect('/signin')
        }
    })
}

//signin 登录的路由(验证用户名是否存在，密码是否正确)
exports.signin = function (req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            return res.redirect('/signup')
        }
        user.comparePassword(password, function (err, isMath) {
            if (err) {
                console.log(err)
            }
            if (isMath) {
                req.session.user = user;
                return res.redirect('/');
            }
            else {
                return res.redirect('/signin')
            }
        })
    })
}

//logout 注销路由
exports.logout = function (req, res) {
    delete req.session.user
    //delete app.locals.user

    res.redirect('/')
}

//用户表单路由 userlist
exports.list = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }

        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        })
    })
};

//midware for user
exports.signinRequired = function (req, res, next) {
    var user = req.session.user

    if (!user) {
        return res.redirect('/signin')
    }
    next()
};

exports.adminRequired = function (req, res, next) {
    var user = req.session.user

    if (user.role <= 10) {
        return res.redirect('/signin')
    }

    next()
};