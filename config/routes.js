var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Catetory = require('../app/controllers/catetory');

module.exports = function(app) {
//pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user

        app.locals.user = _user

        next()
    });

    //Index
    app.get('/', Index.index)

    //User
    app.post('/user/signup', User.signup)
    app.post('/user/signin', User.signin)
    app.get('/signin', User.showSignin)
    app.get('/signup', User.showSignup)
    app.get('/logout', User.logout)
    app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list)

    //movie
    app.get('/movie/:id', Movie.detail)
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
    app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save)
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

    //Comment
    app.post('/user/comment', User.signinRequired, Comment.save)

    //Catetory
    app.get('/admin/catetory/new', User.signinRequired, User.adminRequired, Catetory.new)
    app.post('/admin/catetory', User.signinRequired, User.adminRequired, Catetory.save)
    app.get('/admin/catetory/list', User.signinRequired, User.adminRequired, Catetory.list)
}