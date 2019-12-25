const searchService = require('../../service/search');

module.exports.listSearch = function (request, response) {
    if (!(request.query.text)) {
        return response.status(400).send("INVALID REQUEST");
    }
    const userId = (request.user && request.user.id)? (request.user.id) : -1;
    return searchService.listSearch(request.query.text, request.query.limit, request.query.offset, userId, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data:res
        });
    });
}

module.exports.userSearch = function (request, response) {
    if (!(request.query.text)) {
        return response.status(400).send("INVALID REQUEST");
    }
    const userId = (request.user && request.user.id)? (request.user.id): -1;
    return searchService.userSearch(request.query.text, request.query.limit, request.query.offset, userId, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });
    });
}

module.exports.topicSearch = function (request, response) {
    if (!(request.query.text)) {
        return response.status(400).send("INVALID REQUEST");
    }
    return searchService.topicSearch(request.query.text, request.query.limit, request.query.offset, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: res
        });
    });
}