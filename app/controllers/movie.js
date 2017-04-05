var _ = require('underscore')
var Movie = require('../models/movie')
var Comment = require('../models/comment')
var Catetory = require('../models/catetory')
var fs = require('fs')
var path = require('path')

// detail page
exports.detail = function (req, res) {
    var id = req.params.id
    Movie.update({_id: id}, {$inc: {pv: 1}}, function (err) {
        if(err) {
            console.log(err)
        }
    })
    Movie.findById(id, function (err, movie){
        Comment
            .find({movie: id})
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comments) {
                // console.log('comments:')
                // console.log(comments)
                res.render('detail', {
                    title : "" + movie.title,
                    movie: movie,
                    comments: comments
                })
            })
    })
}

//admin page
exports.new = function (req, res) {
    Catetory.find({}, function (err, catetories) {
        console.log(catetories)
        res.render('admin', {
            title : '后台录入页',
            catetories: catetories,
            movie: {}
        })
    })
}

//admin update movie
exports.update = function(req, res) {
    var id = req.params.id
    if (id) {
        Movie.findById(id, function(err, movie){
            if (err) {
                console.log(err)
            }
            Catetory.find({}, function(err, catetories) {
                res.render('admin', {
                    title: 'Imovie 后台更新页面',
                    movie: movie,
                    catetories: catetories
                })
            })
        })
    }
}

// admin post movie
exports.save = function (req, res){
    // console.log(req.body)
    // console.log(req.body.movie)
    var id = req.body.movie._id
    var movieObj = req.body.movie
    // console.log(movieObj)
    var _movie
    if (req.poster) {
        movieObj.poster = req.poster
    }

    if (id) {
        Movie.findById(id, function (err, movie){
            if (err) {
                console.log(err)
            }
            /*
             _.extend(destination, *sources)
             Copy all of the properties in the source objects over to the destination object,
             and return the destination object. It's in-order, so the last source will override
             properties of the same name in previous arguments.
             */
            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie){
                if (err) {
                    console.log(err)
                }
                var catetoryId = movie.catetory
                Catetory.findById(catetoryId, function (err, catetory) {
                    catetory.movies.push(movie._id)
                    catetory.save (function(err, catetory) {
                        res.redirect('/movie/' + movie._id)
                    })
                })
            })
        })
    } else {
        _movie = new Movie(movieObj)

        var catetoryName = movieObj.catetoryName
        var catetoryId = movieObj.catetory

        _movie.save(function (err, movie){
            console.log(movie)
            if (err) {
                console.log(err)
            }
            if (catetoryId) {
                Catetory.findById(catetoryId, function (err, catetory) {
                    catetory.movies.push(movie._id)
                    catetory.save (function (err, catetory) {
                        res.redirect('/movie/' + movie._id)
                    })
                })
            } else if (catetoryName){
                var catetory = new Catetory({
                    name: catetoryName,
                    movies: [movie._id]
                })
                catetory.save(function (err, catetory) {
                    movie.catetory = catetory._id
                    movie.save(function (err, movie) {
                        res.redirect('/movie/' + movie._id)
                    })
                })
            }

        })
    }
}

//list page
exports.list = function(req, res) {
    Movie.fetch(function (err, movies){
        if (err) {
            console.log(err)
        }
        // console.log("mark")
        res.render('list', {
            title: 'Imovie 列表页',
            movies: movies
        })
    })
}

//list delete movie
exports.del = function (req, res){
    var id = req.query.id
    console.log(id)
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({success:1})
            }
        })
    }
}

//save movie poster
exports.savePoster = function (req, res, next) {
    console.log('hello')
    console.log(req.body)
    var posterData = req.files.uploadPoster
    var filePath = posterData.path
    var originalFilename = posterData.originalFilename

    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            var timestamp = Date.now()
            var type = posterData.type.split('/')[1]
            var poster = timestamp + '.' + type
            var newPath = path.join(__dirname, '../../', 'public/upload/' + poster)

            fs.writeFile(newPath, data, function (err) {
                req.poster = poster
                next()
            })
        })
    } else {
        next()
    }
}
