var Movie = require('../models/movie');
var Catetory = require('../models/catetory');
// index page
exports.index = function(req, res) {
    Catetory
        .find({})
        .populate({path: 'movies', options: {limit: 5}})
        .exec(function (err, catetories) {
            if (err) {
                console.log(err)
            }

            res.render('index', {
                title: 'imooc 首页',
                catetories: catetories
            })
        })
}