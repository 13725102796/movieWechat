var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,

    //0: nomal user 普通用户
    //1: verified user 邮件激活后的用户
    //2: professonal user 资料完整的用户
    //>10: admin
    //>50: super admin
    role: {
        type: Number,
        default: 0
    },

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
UserSchema.pre('save', function (next) {
    var user = this

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    //生成随机的盐
    /*bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        bcrypt.hash("user.password", salt, function(err, hash) {
            if (err) {
                return next(err)
            }

            user.password = hash;
            next();
        });
    });*/
    bcrypt.hash(user.password, null, null, function (err, hash){
        if (err) {
            return next(err)
        }
        user.password = hash
        next()
    })
})
//增加实例方法 compare

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, res) {
            if (err) {
                cb(err)
            }
            cb(null, res)
        })
    }
}

// 静态方法：fetch查找所有用户， findById通过id查找用户，通过模型就可以调用
UserSchema.statics = {
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
    },
    findByName: function(_name, cb) {
        return this
            .findOne({name: _name})
            .exec(cb)
    }
};

module.exports = UserSchema;