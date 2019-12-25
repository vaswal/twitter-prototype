const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repository = require('../../repository/mysql');
const { Tweet, UserAnalytics } = require('../../repository/mongo');
const cache = require('../../cache');
const async = require('async');

module.exports.create = function (newUser, cb) {
    return bcrypt.genSalt(10, (err, salt) => {
        if (err) return cb(err);

        return bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return cb(err);

            newUser.password = hash;
            return repository.User.create({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                data: newUser.data ? newUser.data : {}
            }).then(function (user) {
                return cb(null, { message: "USER SUCCESSFULLY REGISTERED" });

            }, function (err) {
                return cb(err);
            });

        });
    })
}

module.exports.verifyAndAssignToken = function (credentials, user, cb) {
    bcrypt.compare(
        credentials,
        user.password)
        .then(match => {
            if (!match) {
                return cb({
                    code: 401,
                    message: 'INVALID CREDENTIALS'
                })
            }
            const tokenParams = {
                id: user.id,
                username: user.username
            };

            jwt.sign(tokenParams, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRYTIME
            }, (err, token) => {
                return cb(err, token);
            });
        }, err => {
            return cb(err);
        });
}

module.exports.update = function (newUser, cb) {

    return repository.User.findOne({
        where: {
            id: newUser.id
        }
    }).then(function (user) {

        if (user) {

            return async.series([
                function (icb) {

                    if (newUser.password && newUser.currentPassword) {

                        return module.exports.verifyAndAssignToken(newUser.currentPassword, user, function (err, token) {
                            if (err) {
                                return icb(err);
                            }

                            return bcrypt.genSalt(10, (err, salt) => {
                                if (err) return cb(err);

                                return bcrypt.hash(newUser.password, salt, (err, hash) => {
                                    if (err) return cb(err);

                                    newUser.password = hash;
                                    return icb();
                                });
                            });

                        });
                    } else {
                        newUser.password = user.password;
                        return icb();
                    }
                }
            ], function (err) {

                if (err) {
                    return cb(err);
                }

                var userDTO = {
                    firstName: newUser.firstName ? newUser.firstName : user.firstName,
                    lastName: newUser.lastName ? newUser.lastName : user.lastName,
                    username: newUser.username ? newUser.username : user.username,
                    email: newUser.email ? newUser.email : user.email,
                    password: newUser.password,
                    data: newUser.data ? {
                        ...user.data,
                        ...newUser.data
                    } : user.data
                };

                return repository.User.update(userDTO,
                    {
                        where: {
                            id: newUser.id
                        }
                    }).then(function (user) {

                        userDTO.id = newUser.id;
                        userDTO.password = undefined;
                        cache.set('user-getById-' + newUser.id, JSON.stringify(userDTO), function (err) {
                            if (err) {
                                console.log("Write to Cache Failed >>>> err: " + JSON.stringify(err, null, 4));
                            } else {
                                cache.expire('user-getById-' + newUser.id, process.env.CACHE_EXPIRY_TIME);
                            }

                        })

                        return module.exports.getById(newUser.id, -1, cb);

                    }, function (err) {
                        return cb(err);
                    });
            })
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });


    }, function (err) {
        return cb(err);
    });

}


module.exports.getById = function (userId, followerId, cb) {

    cache.get('user-getById-' + userId, function (err, user) {
        if (user) {
            user = JSON.parse(user);
            if (userId != followerId) {
                UserAnalytics.create({
                    ownerId: user.id
                }).then(user => {

                }, function (err) {
                    console.log(err);
                })
            }
            return cb(null, user);
        } else {
            repository.User.findOne({
                where: {
                    id: userId
                }
            }).then(function (user) {

                if (user) {
                    return user.hasFollower(followerId).then(has => {
                        var userDTO = {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            username: user.username,
                            email: user.email,
                            followed: has,
                            createdAt: user.createdAt,
                            // active: user.active,
                            data: user.data ? { ...user.data, views: user.data.views ? user.data.views + 1 : 1 } : { views: 1 }
                        };

                        cache.set('user-getById-' + userId, JSON.stringify(userDTO), function (err) {
                            if (err) {
                                console.log("Write to Cache Failed >>>> err: " + JSON.stringify(err, null, 4));
                            } else {
                                cache.expire('user-getById-' + userId, process.env.CACHE_EXPIRY_TIME);
                            }

                        });

                        if (userId != followerId) {
                            UserAnalytics.create({
                                ownerId: user.id
                            }).then(user => {

                            }, function (err) {
                                console.log(err);
                            })
                        }

                        return cb(null, userDTO);
                    }, function (err) {
                        return cb(err);
                    })

                }
                return cb({
                    code: 404,
                    message: "USER NOT FOUND"
                });

            }, function (err) {
                return cb(err);
            });
        }
    })

}

module.exports.getByEmailOrUsername = function (email, username, cb) {
    repository.User.findOne({
        where: {
            $or: [
                {
                    email
                },
                {
                    username
                }
            ]
        }
    }).then(function (user) {
        if (user) {
            return cb(null, {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                password: user.password,
                active: user.active,
                data: user.data ? user.data : null
            });
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    });
}

module.exports.followUser = function (userId, followeeId, cb) {
    return repository.User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            return user.addFollowee(followeeId)
                .then(function (data) {
                    return cb(null, {
                        message: "SUCCESS"
                    });
                }, function (err) {
                    return cb(err);
                });
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.unfollowUser = function (userId, followeeId, cb) {
    return repository.User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            return user.removeFollowee(followeeId)
                .then(function (data) {
                    return cb(null, {
                        message: "SUCCESS"
                    });
                }, function (err) {
                    return cb(err);
                });
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.getFollowers = function (userId, limit, offset, cb) {
    limit = limit ? limit : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? offset : 0;
    return repository.User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            return user.countFollowers().then(count => {
                if (offset >= count) {
                    return cb({
                        code: 202,
                        status: 'ok',
                        data: { count: 0 }
                    });
                }
                return user.getFollowers({
                    attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
                    where: { active: true },
                    limit,
                    offset,
                    required: false
                }).then(followers => {
                    return user.getFollowees({ attributes: ['id'] }).then(followees => {
                        followees = followees.map(f => f.id);
                        return cb(null, {
                            id: user.id,
                            count,
                            followers: followers.map(f => ({
                                id: f.id,
                                firstName: f.firstName,
                                lastName: f.lastName,
                                username: f.username,
                                email: f.email,
                                followed: followees.includes(f.id),
                                createdAt: f.UserFollowing.createdAt
                            })),
                            nextOffset: (offset + limit) < count ? (offset + limit) : 0
                        });

                    }, function (err) {
                        return cb(err);
                    })
                }, function (err) {
                    return cb(err);
                });
            }, function (err) {
                return cb(err);
            });
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.getFollowees = function (userId, limit, offset, cb) {
    limit = limit ? limit : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? offset : 0;
    return repository.User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            return user.countFollowees().then(count => {
                if (offset >= count) {
                    return cb({
                        code: 202,
                        status: 'ok',
                        data: { count: 0 }
                    });
                }
                return user.getFollowees({
                    attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
                    where: { active: true },
                    limit,
                    offset,
                    required: false
                }).then(followees => {
                    return cb(null, {
                        id: user.id,
                        count,
                        followees: followees.map(f => ({
                            id: f.id,
                            firstName: f.firstName,
                            lastName: f.lastName,
                            username: f.username,
                            email: f.email,
                            followed: true,
                            createdAt: f.UserFollowing.createdAt
                        })),
                        nextOffset: (offset + limit) < count ? (offset + limit) : 0
                    });
                }, function (err) {
                    return cb(err);
                });
            }, function (err) {
                return cb(err);
            });
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.getListsAsMember = function (userId, limit, offset, cb) {
    limit = limit ? limit : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? offset : 0;
    return repository.User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            return user.countListsAsMember().then(count => {
                if (offset >= count) {
                    return cb({
                        code: 204,
                        message: 'NO CONTENT'
                    });
                }
                return user.getListsAsMember({
                    attributes: ['id', 'name', 'description', 'data', 'createdAt'],
                    limit,
                    offset,
                    required: false
                }).then(listsAsMember => {
                    return cb(null, {
                        id: user.id,
                        count,
                        listsAsMember: listsAsMember.map(l => ({
                            id: l.id,
                            name: l.name,
                            description: l.description,
                            data: l.data,
                            createdAt: l.createdAt
                        })),
                        nextOffset: (offset + limit) < count ? (offset + limit) : 0
                    });
                }, function (err) {
                    return cb(err);
                });
            }, function (err) {
                return cb(err);
            });
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.getListsAsSubscriber = function (userId, limit, offset, cb) {
    limit = limit ? limit : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? offset : 0;
    return repository.User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            return user.countListsAsSubscriber().then(count => {
                if (offset >= count) {
                    return cb({
                        code: 204,
                        message: 'NO CONTENT'
                    });
                }
                return user.getListsAsSubscriber({
                    attributes: ['id', 'name', 'description', 'data', 'createdAt'],
                    limit,
                    offset,
                    required: false
                }).then(listsAsSubscriber => {
                    return cb(null, {
                        id: user.id,
                        count,
                        listsAsSubscriber: listsAsSubscriber.map(l => ({
                            id: l.id,
                            name: l.name,
                            description: l.description,
                            data: l.data,
                            createdAt: l.createdAt
                        })),
                        nextOffset: (offset + limit) < count ? (offset + limit) : 0
                    });
                }, function (err) {
                    return cb(err);
                });
            }, function (err) {
                return cb(err);
            });
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.getListsAsOwner = function (userId, limit, offset, cb) {
    limit = limit ? limit : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? offset : 0;
    return repository.User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            return user.countLists().then(count => {
                if (offset >= count) {
                    return cb({
                        code: 204,
                        message: 'NO CONTENT'
                    });
                }
                return user.getLists({
                    attributes: ['id', 'name', 'description', 'data', 'createdAt'],
                    limit,
                    offset,
                    required: false
                }).then(listsAsOwner => {
                    return cb(null, {
                        id: user.id,
                        count,
                        listsAsOwner: listsAsOwner.map(l => ({
                            id: l.id,
                            name: l.name,
                            description: l.description,
                            data: l.data,
                            createdAt: l.createdAt
                        })),
                        nextOffset: (offset + limit) < count ? (offset + limit) : 0
                    });
                }, function (err) {
                    return cb(err);
                });
            }, function (err) {
                return cb(err);
            });
        }
        return cb({
            code: 404,
            message: "USER NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.deactivate = function (userId, cb) {
    repository.User.update({
        active: false
    }, {
        where: {
            id: userId
        }
    }).then(function (user) {

        Tweet.update({
            ownerId: userId
        }, {
            active: false
        }).then(function (tweets) {
            console.log("Tweets deactivated")
        }, function (err) {
            console.log(err);
        })

        return cb(null, { message: "DEACTIVATION SUCCESFULL" });


    }, function (err) {
        return cb(err);
    })
}

module.exports.reactivate = function (userId, cb) {
    return repository.User.update({
        active: true
    }, {
        where: {
            id: userId
        }
    }).then(function (user) {

        Tweet.update({
            ownerId: userId
        }, {
            active: true
        }).then(function (tweets) {
            console.log("Tweets reactivated")
        }, function (err) {
            console.log(err);
        })

        return cb(null, { message: "REACTIVATION SUCCESFULL" });


    }, function (err) {
        return cb(err);
    })
}