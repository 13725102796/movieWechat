var Catetory = require('../models/catetory')


//admin new catetory
exports.new = function (req, res) {
    res.render('adminCatetory', {
        title : '后台录入页',
        catetory: {
            name: ""
        }
    })
}



// admin post catetory
exports.save = function (req, res){
    var _catetory = req.body.catetory
    Catetory.findOne({name: _catetory.name}, function (err, catetory) {
        if (!catetory ) {
            var newCatetory = new Catetory(_catetory)
            newCatetory.save(function (err, catetory) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/admin/catetory/list')
            })
        }
    })
}

//catetory list page
exports.list = function(req, res) {
    Catetory.fetch(function (err, catetories){
        if (err) {
            console.log(err)
        }
        // console.log("mark")
        res.render('catetoryList', {
            title: '分类列表页',
            catetories: catetories
        })
    })
}
