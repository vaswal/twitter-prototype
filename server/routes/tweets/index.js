const tweetService = require('../../service/tweets');


module.exports.createTweet = function (request, response) {
    if (!(request.body && request.body.data && request.body.ownerId
        && request.body.owner)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return tweetService.create(request.body, function (err, res) {
        if (err) return response.status(err.code ? err.code : 500).send(err);
        return response.send({
            status: "ok",
            data: res
        });
    });
}

module.exports.reply = function (request, response) {
    if (!(request.body && request.body.data && request.body.ownerId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return tweetService.reply(request.params.id, request.body, function (err, res) {
        if (err) return response.status(err.code ? err.code : 500).send(err);
        return response.send({
            status: "ok",
            data: res
        });
    });
}

module.exports.getReplies = function (request, response) {

    if (!(request.params && request.params.id)) {
        return response.status(400).send("INVALID REQUEST");
    }

    return tweetService.getReplies(request.params.id, request.query.limit, request.query.offset, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.getTweetsByOwnerId = function (request, response) {

    if (!(request.params && request.params.ownerId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    var pagination = {
        skip: 0,
        limit: Number(process.env.DEFAULT_PAGE_LIMIT)
    };
    if (request.query.offset) pagination.skip = Number(request.query.offset);
    if (request.query.limit) pagination.limit = Number(request.query.limit);

    return tweetService.getByOwnerId(request.params.ownerId, pagination, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.getTweetByTweetId = function (request, response) {
    if (!(request.params && request.params.tweetId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return tweetService.getByTweetId(request.params.tweetId, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.likeTweet = function (request, response) {
    if (!(request.params && request.body.tweetId && request.params.userId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return tweetService.likeTweet(request.params.userId, request.body.tweetId, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.viewTweet = function (request, response) {
    if (!(request.params && request.body.tweetId && request.params.userId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return tweetService.viewTweet(request.params.userId, request.body.tweetId, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.retweet = function (request, response) {
    if (!(request.body && request.params.tweetId && request.body.data && request.body.ownerId && request.body.owner)) {
        return response.status(400).send("INVALID REQUEST");
    }

    return tweetService.retweet(request.params.tweetId, request.body, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.getTweetsBySubscriber = function (request, response) {
    if (!(request.params && request.params.userId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    var pagination = {
        skip: 0,
        limit: Number(process.env.DEFAULT_PAGE_LIMIT)
    };
    if (request.query.offset) pagination.skip = Number(request.query.offset);
    if (request.query.limit) pagination.limit = Number(request.query.limit);

    return tweetService.getTweetsBySubscriber(request.params.userId, pagination, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.deleteTweet = function (request, response) {
    if (!(request.params && request.params.tweetId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return tweetService.deleteTweet(request.params.tweetId, function (err, data) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: data
        });

    });
}

module.exports.getTweetsByList = function (request, response) {
    if (!(request.params && request.params.listId)) {
        return response.status(400).send("INVALID REQUEST");
    }
    var pagination = {
        skip: 0,
        limit: Number(process.env.DEFAULT_PAGE_LIMIT)
    };
    if (request.query.offset) pagination.skip = Number(request.query.offset);
    if (request.query.limit) pagination.limit = Number(request.query.limit);

    return tweetService.getByList(request.params.listId, pagination, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.getByHashtag = function (request, response) {
    if (!(request.params && request.params.hashtag)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return tweetService.getByHashtag(request.params.hashtag, function (err, data) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}

module.exports.getByLikedTweets = function (request, response) {
    if (!(request.params && request.params.id)) {
        return response.status(400).send("INVALID REQUEST");
    }
    var pagination = {
        skip: 0,
        limit: Number(process.env.DEFAULT_PAGE_LIMIT)
    };
    if (request.query.offset) pagination.skip = Number(request.query.offset);
    if (request.query.limit) pagination.limit = Number(request.query.limit);

    return tweetService.getByLikedTweets(request.params.id, pagination, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });

    });
}