'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var userService = require('../service/users');

module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };
    console.log(opts);
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        console.log(jwt_payload);
        userService.getById(jwt_payload.id, -1, function(err, user){
            if(err){
                return callback(err, false);
            }
            return callback(null, user);
        })
    }));
};
