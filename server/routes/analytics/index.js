const analyticsService = require('../../service/analytics');


module.exports.topTweetsByViews = function (request, response) {

    return analyticsService.topTweetsByViews(request.params.id, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: {
                res
            }
        });
    });
}

module.exports.topTweetsByLikes = function (request, response) {

    return analyticsService.topTweetsByLikes(request.params.id, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: {
                res
            }
        });
    });
}

module.exports.topTweetsByRetweets = function (request, response) {

    return analyticsService.topTweetsByRetweets(request.params.id, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: {
                res
            }
        });
    });
}

module.exports.hourlyTweetCountPerDay = function (request, response) {

    return analyticsService.hourlyTweetCountPerDay(request.params.id, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: {
                res
            }
        });
    });
}

module.exports.dailyTweetCountPerWeek = function (request, response) {

    return analyticsService.dailyTweetCountPerWeek(request.params.id, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: {
                res
            }
        });
    });
}

module.exports.monthlyTweetCountPerYear = function (request, response) {

    return analyticsService.monthlyTweetCountPerYear(request.params.id, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: {
                res
            }
        });
    });
}

module.exports.dailyProfileViewsCountPerMonth = function (request, response) {

    return analyticsService.dailyProfileViewsCountPerMonth(request.params.id, function (err, res) {
        if (err) {
            return response.status(err.code ? err.code : 500).send(err);
        }
        return response.send({
            status: "ok",
            data: {
                res
            }
        });
    });
}

