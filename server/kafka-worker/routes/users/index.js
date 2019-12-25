const userService = require('../../../service/users');

module.exports.register = function (request, response) {
    if (!(request.body.firstName && request.body.lastName && request.body.email
        && request.body.username && request.body.password)) {
        return response({
            code:400,
            message:"INVALID REQUEST"
        });
    }
    return userService.getByEmailOrUsername(request.body.email, request.body.username, function (err, user) {
        if (err)
            return response({
                code:err.code?err.code:500,
                message:err.message?err.message:err
            });
        if (user) {
            return response({
                code:400,
                message:"EMAIL OR USERNAME ALREADY EXITS"
            });
        }

        return userService.create(request.body, response);
    });

}

module.exports.login = function (request, response) {

    if (!(request.body.username && request.body.password)) {
        return response({
            code:400,
            message:"INVALID REQUEST"
        });
    }

    return userService.getByEmailOrUsername(null, request.body.username, function (err, user) {
        if (err)
        return response({
            code:err.code?err.code:500,
            message:err.message?err.message:err
        });

        return userService.verifyAndAssignToken(request.body.password, user, response);
    });


}


module.exports.get = function (request, response) {
    if (!(request.params.id)) {
        return response({
            code:400,
            message:"INVALID REQUEST"
        });
    }
    const userId = request.user && request.user.id && request.params.id != request.user.id? request.user.id: -1;
    return userService.getById(request.params.id, userId, response);
}

module.exports.follow = function (request, response) {
    if (!(request.params.id && request.body.followeeId)) {
        return response({
            code:400,
            message:"INVALID REQUEST"
        });
    }
    return userService.followUser(request.params.id, request.body.followeeId, response);
}

module.exports.unfollow = function (request, response) {
    if (!(request.params.id && request.body.followeeId)) {
        return response({
            code:400,
            message:"INVALID REQUEST"
        });
    }
    return userService.unfollowUser(request.params.id, request.body.followeeId, response);
}

module.exports.getFollowers = function (request, response) {
    return userService.getFollowers(request.params.id, request.query.limit, request.query.offset, response);
}

module.exports.getFollowees = function (request, response) {
    return userService.getFollowees(request.params.id, request.query.limit, request.query.offset, response);
}

module.exports.getListsAsMember = function (request, response) {
    return userService.getListsAsMember(request.params.id, request.query.limit, request.query.offset, response);
}

module.exports.getListsAsSubscriber = function (request, response) {
    return userService.getListsAsSubscriber(request.params.id, request.query.limit, request.query.offset, response);
}

module.exports.getListsAsOwner = function (request, response) {
    return userService.getListsAsOwner(request.params.id, request.query.limit, request.query.offset, response);
}