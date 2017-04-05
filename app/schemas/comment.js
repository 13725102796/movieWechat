var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
    movie: {type: ObjectId, ref: 'Movie'},
    from: {type: ObjectId, ref: 'User'},
    reply: [{
        from: {type: ObjectId, ref: 'User'},
        to: {type: ObjectId, ref: 'User'},
        content: String,
    }],
    to: {type: ObjectId, ref: 'User'},
    content: String,
    meta: { //更新数据的时间记录
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});
// 每次存储数据之前，都会调用该方法
CommentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    next()
});

CommentSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
};

module.exports = CommentSchema;