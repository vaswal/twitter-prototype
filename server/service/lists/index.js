const repository = require('../../repository/mysql');

module.exports.create = function (newList, cb) {

    return repository.List.create({
        name: newList.name,
        description: newList.description,
        userId: newList.userId,
        data: newList.data ? newList.data : null
    }).then(function (list) {
        if (list) {
            return list.addMember(newList.userId)
                .then(function (data) {
                    return cb(null, { list });
                }, function (err) {
                    return cb(err);
                });
        }
        return cb({
            code: 500,
            message: "LIST COULD NOT BE CREATED"
        });

    }, function (err) {
        return cb(err);
    });

}

module.exports.getById = function (listId, userId, cb) {
    repository.List.findOne({
        where: {
            id: listId
        }
    }).then(function (list) {

        if (list) {
            return list.hasSubscriber(userId).then(has => {
                return list.countMembers().then(membersCount => {
                    return list.countSubscribers().then(subscribersCount => {
                        return cb(null, {
                            list: {
                                id: list.id,
                                name: list.name,
                                description: list.description,
                                ownerId: list.userId,
                                subscribed: has,
                                membersCount,
                                subscribersCount,
                                createdAt: list.createdAt,
                                data: list.data ? list.data : null
                            }
                        });
                    }, function (err) {
                        return cb(err);
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
            message: "LIST NOT FOUND"
        });

    }, function (err) {
        return cb(err);
    });
}

module.exports.getByName = function (name, userId, cb) {
    repository.List.findOne({
        where: {
            name,
            userId
        }
    }).then(function (list) {
        if (list) {
            return cb(null, {
                id: list.id,
                name: list.name,
                description: list.description,
                ownerId: list.userId,
                data: list.data ? list.data : null
            });
        }
        return cb({
            code: 404,
            message: "LIST NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    });
}

module.exports.subscribe = function (listId, subscriberId, cb) {
    return repository.List.findOne({
        where: {
            id: listId
        }
    }).then(function (list) {
        if (list) {
            return list.addSubscriber(subscriberId)
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
            message: "LIST NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.unsubscribe = function (listId, subscriberId, cb) {
    return repository.List.findOne({
        where: {
            id: listId
        }
    }).then(function (list) {
        if (list) {
            return list.removeSubscriber(subscriberId)
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
            message: "LIST NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.getSubscribers = function (listId, limit, offset, cb) {
    limit = limit ? limit : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? offset : 0;
    return repository.List.findOne({
        where: {
            id: listId
        }
    }).then(function (list) {
        if (list) {
            return list.countSubscribers().then(count => {
                if (offset >= count) {
                    return cb({
                        code: 204,
                        message: 'NO CONTENT'
                    });
                }
                return list.getSubscribers({
                    attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
                    where:{active:true},
                    limit,
                    offset,
                    required: false
                }).then(subscribers => {
                    return cb(null, {
                        id: list.id,
                        count,
                        subscribers: subscribers.map(s => ({
                            id: s.id,
                            firstName: s.firstName,
                            lastName: s.lastName,
                            username: s.username,
                            email: s.email,
                            createdAt: s.ListSubscription.createdAt
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
            message: "LIST NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.addMember = function (listId, memberId, cb) {
    return repository.List.findOne({
        where: {
            id: listId
        }
    }).then(function (list) {
        if (list) {
            return list.addMember(memberId)
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
            message: "LIST NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.removeMember = function (listId, memberId, cb) {
    return repository.List.findOne({
        where: {
            id: listId
        }
    }).then(function (list) {
        if (list) {
            return list.removeMember(memberId)
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
            message: "LIST NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}

module.exports.getMembers = function (listId, limit, offset, cb) {
    limit = limit ? limit : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? offset : 0;
    return repository.List.findOne({
        where: {
            id: listId
        }
    }).then(function (list) {
        if (list) {
            return list.countMembers().then(count => {
                if (offset >= count) {
                    return cb({
                        code: 204,
                        message: 'NO CONTENT'
                    });
                }
                return list.getMembers({
                    attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
                    where:{active:true},
                    limit,
                    offset,
                    required: false
                }).then(members => {
                    return cb(null, {
                        id: list.id,
                        count,
                        members: members.map(m => ({
                            id: m.id,
                            firstName: m.firstName,
                            lastName: m.lastName,
                            username: m.username,
                            email: m.email,
                            createdAt: m.ListMembership.createdAt
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
            message: "LIST NOT FOUND"
        });
    }, function (err) {
        return cb(err);
    })
}


