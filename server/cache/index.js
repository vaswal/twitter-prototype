const redis = require('./redis');
const _ = require('lodash');
module.exports.get = function (key, cb) {
    if (_.isArray(key)) {
        redis.mget(key, function (err, result) {
            return cb(err, result)
        })
    }
    else {
        redis.get(key, function (err, result) {
            return cb(err, result)
        })
    }
}

module.exports.set = function (key, value, cb) {
    redis.set(key, value, function (err) {
        if (cb)
            return cb(err)
    })
}

module.exports.expire = function (key, value, cb) {
    redis.expire(key, value, function () {
        if (cb)
            return cb()
    })
}

module.exports.del = function (key) {
    redis.del(key)
}
