const repo_mysql = require('../../repository/mysql');
const repo_mongo = require('../../repository/mongo');
const moment = require('moment');
const DESC = -1;
const ASC = 1;

module.exports.topTweetsByViews = function (userId, cb) {

    repo_mongo.Tweet.aggregate([
        {
            $match: {
                ownerId: Number(userId)
            }
        },
        {
            $sort: {
                "views.count": DESC
            }
        },
        {
            $limit: Number(process.env.DEFAULT_PAGE_LIMIT)
        }
    ]).then(function (tweets) {
        if (tweets) {
            var res = tweets.map(tweet => ({
                numOfViews: tweet.views.count,
                tweet: {
                    id: tweet.tweetId,
                    likes: tweet.likes.count,
                    views: tweet.views.count,
                    replies: tweet.replies,
                    data: tweet.data,
                    hashTags: tweet.hashTags
                }
            }));
            return cb(null, res);
        }
        return cb(null, []);
    }, function (err) {
        return cb(err);
    })
}

module.exports.topTweetsByLikes = function (userId, cb) {

    repo_mongo.Tweet.aggregate([
        {
            $match: {
                ownerId: Number(userId)
            }
        },
        {
            $sort: {
                "likes.count": DESC
            }
        },
        {
            $limit: Number(process.env.DEFAULT_PAGE_LIMIT)
        }
    ]).then(function (tweets) {
        if (tweets) {
            var res = tweets.map(tweet => ({
                numOfLikes: tweet.likes.count,
                tweet: {
                    id: tweet.tweetId,
                    likes: tweet.likes.count,
                    views: tweet.views.count,
                    replies: tweet.replies,
                    retweet: tweet.retweet,
                    data: tweet.data,
                    hashTags: tweet.hashTags
                }
            }));
            return cb(null, res);
        }
    }, function (err) {
        return cb(err);
    })
}

module.exports.topTweetsByRetweets = function (userId, cb) {

    repo_mongo.Tweet.aggregate([
        {
            $match: {
                ownerId: Number(userId)
            }
        },
        {
            $sort: {
                retweetCount: DESC
            }
        },
        {
            $limit: Number(process.env.DEFAULT_PAGE_LIMIT)
        }
    ]).then(function (tweets) {
        if (tweets) {
            var res = tweets.map(tweet => ({
                numOfRetweet: tweet.retweetCount.count,
                tweet: {
                    id: tweet.tweetId,
                    likes: tweet.likes.count,
                    views: tweet.views.count,
                    retweet: tweet.retweet,
                    replies: tweet.replies,
                    data: tweet.data,
                    hashTags: tweet.hashTags,
                    retweetCount: tweet.retweetCount
                }
            }));
            return cb(null, res);
        }
    }, function (err) {
        return cb(err);
    })
}

module.exports.hourlyTweetCountPerDay = function (userId, cb) {
    const currentTime = moment().startOf('day');
    const concat = Array(24).fill().map((_, idx) => ({
        $cond: [
            {
                $and: [
                    {
                        $gte: [
                            "$createdAt",
                            currentTime.set('hours', idx).toDate()
                        ]
                    },
                    {
                        $lt: [
                            "$createdAt",
                            currentTime.set('hours', (idx + 1)).toDate()
                        ]
                    }
                ]
            },
            `${idx < 12 ? idx + " am" : (idx - 12) + " pm"}`,
            ""
        ]
    }));

    return repo_mongo.Tweet.aggregate([
        {
            $match: {
                ownerId: Number(userId)
            }
        },
        {
            $project: {
                "range": {
                    $concat: concat
                }
            }
        },
        {
            $group: {
                "_id": "$range",
                count: {
                    $sum: 1
                }
            }
        }
    ]).then(function (data) {
        if (data) {

            var res = data.reduce((r, record) => ({
                ...r,
                [record._id]: record.count
            }), {});
            res = Array(24).fill().reduce((entry, x, idx) => {

                const key = `${idx < 12 ? idx + " am" : (idx - 12) + " pm"}`
                entry.push({ [key]: res[key] ? res[key] : 0 });
                return entry;

            }, []);
            return cb(null, res);
        }
        return cb(null, null);
    }, function (err) {
        return cb(err);
    })
}

module.exports.dailyTweetCountPerWeek = function (userId, cb) {
    const currentTime = moment().startOf('day').format();
    const concat = Array(7).fill().map((_, idx) => ({
        $cond: [
            {
                $and: [
                    {
                        $gte: [
                            "$createdAt",
                            moment(currentTime).subtract('days', (7 - (idx + 1))).toDate()
                        ]
                    },
                    {
                        $lt: [
                            "$createdAt",
                            moment(currentTime).subtract('days', (7 - (idx + 2))).toDate()
                        ]
                    }
                ]
            },
            `${moment(currentTime).subtract('days', (7 - (idx + 1))).format('dddd')}`,
            ""
        ]
    }));

    return repo_mongo.Tweet.aggregate([
        {
            $match: {
                ownerId: Number(userId)
            }
        },
        {
            $project: {
                "range": {
                    $concat: concat
                }
            }
        },
        {
            $group: {
                "_id": "$range",
                count: {
                    $sum: 1
                }
            }
        }
    ]).then(function (data) {
        if (data) {
            var res = data.reduce((r, record) => ({
                ...r,
                [record._id]: record.count
            }), {});
            res = Array(7).fill().reduce((entry, x, idx) => {

                const key = moment(currentTime).subtract('days', (7 - (idx + 1))).format('dddd')
                entry.push({ [key]: res[key] ? res[key] : 0 });
                return entry;

            }, []);
            return cb(null, res);
        }
        return cb(null, null);
    }, function (err) {
        return cb(err);
    })
}

module.exports.monthlyTweetCountPerYear = function (userId, cb) {
    const currentTime = moment().startOf('month').format();
    const concat = Array(12).fill().map((_, idx) => ({
        $cond: [
            {
                $and: [
                    {
                        $gte: [
                            "$createdAt",
                            moment(currentTime).subtract('months', (12 - (idx + 1))).toDate()
                        ]
                    },
                    {
                        $lt: [
                            "$createdAt",
                            moment(currentTime).subtract('months', (12 - (idx + 2))).toDate()
                        ]
                    }
                ]
            },
            `${moment(currentTime).subtract('months', (12 - (idx + 1))).format('MMMM')}`,
            ""
        ]
    }));

    return repo_mongo.Tweet.aggregate([
        {
            $match: {
                ownerId: Number(userId)
            }
        },
        {
            $project: {
                "range": {
                    $concat: concat
                }
            }
        },
        {
            $group: {
                "_id": "$range",
                count: {
                    $sum: 1
                }
            }
        }
    ]).then(function (data) {
        if (data) {
            var res = data.reduce((r, record) => ({
                ...r,
                [record._id]: record.count
            }), {});
            res = Array(12).fill().reduce((entry, x, idx) => {

                const key = moment(currentTime).subtract('months', (12 - (idx + 1))).format('MMMM')
                entry.push({ [key]: res[key] ? res[key] : 0 });
                return entry;

            }, []);
            return cb(null, res);
        }
        return cb(null, null);
    }, function (err) {
        return cb(err);
    })
}

module.exports.dailyProfileViewsCountPerMonth = function (userId, cb) {
    const currentTime = moment().startOf('day').format();
    const concat = Array(30).fill().map((_, idx) => ({
        $cond: [
            {
                $and: [
                    {
                        $gte: [
                            "$createdAt",
                            moment(currentTime).subtract('days', (30 - (idx + 1))).toDate()
                        ]
                    },
                    {
                        $lt: [
                            "$createdAt",
                            moment(currentTime).subtract('days', (30 - (idx + 2))).toDate()
                        ]
                    }
                ]
            },
            `${moment(currentTime).subtract('days', (30 - (idx + 1))).format('Do MMM')}`,
            ""
        ]
    }));

    return repo_mongo.UserAnalytics.aggregate([
        {
            $match: {
                ownerId: Number(userId)
            }
        },
        {
            $project: {
                "range": {
                    $concat: concat
                }
            }
        },
        {
            $group: {
                "_id": "$range",
                count: {
                    $sum: 1
                }
            }
        }
    ]).then(function (data) {
        if (data) {
            var res = data.reduce((r, record) => ({
                ...r,
                [record._id]: record.count
            }), {});
            res = Array(30).fill().reduce((entry, x, idx) => {

                const key = moment(currentTime).subtract('days', (30 - (idx + 1))).format('Do MMM');
                entry.push({ [key]: res[key] ? res[key] : 0 });
                return entry;

            }, []);
            return cb(null, res);
        }
        return cb(null, null);
    }, function (err) {
        return cb(err);
    })
}
