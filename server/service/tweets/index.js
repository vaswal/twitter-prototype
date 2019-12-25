const repository = require('../../repository/mongo');
const { User, List } = require('../../repository/mysql');
const cache = require('../../cache');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');

function extractHashTags(data) {
    if (data.text && _.isString(data.text)) {
        return data.text.match(/\B(#[A-Za-z0-9\-\.\_\?]+\b)/g);
    }
    return ['#general'];
}

function tweetMapper(tweets) {
    if (tweets && _.isArray(tweets)) {
        repository.Tweet.findOneAndUpdate(
            { tweetId: { $in: tweets.map(t => t.tweetId) } },
            { $inc: { "views.count": 1 } }
        ).then(function (tweet) {
            console.log('viewed');
        });
        return tweets.map(tweet => ({
            id: tweet.tweetId,
            ownerId: tweet.ownerId,
            owner: tweet.owner,
            likes: tweet.likes.count,
            views: tweet.views.count,
            retweetCount: tweet.retweetCount,
            replyCount: tweet.replyCount,
            data: tweet.data ? tweet.data : null,
            retweet: tweet.retweet,
            hashTags: tweet.hashTags,
            createdAt: tweet.createdAt
        }));
    } else if (tweets && _.isObject(tweets)) {
        var tweet = tweets;
        repository.Tweet.findOneAndUpdate(
            { tweetId: tweet.tweetId },
            { $inc: { "views.count": 1 } }
        ).then(function (tweet) {
            console.log('viewed');
        });
        return {
            id: tweet.tweetId,
            ownerId: tweet.ownerId,
            owner: tweet.owner,
            likes: tweet.likes.count,
            views: tweet.views.count,
            retweetCount: tweet.retweetCount,
            data: tweet.data ? tweet.data : null,
            retweet: tweet.retweet,
            hashTags: tweet.hashTags,
            createdAt: tweet.createdAt
        }
    } else {
        return null;
    }
}

module.exports.create = function (newTweet, cb) {
    var hashTags = extractHashTags(newTweet.data);
    repository.Tweet.create({
        tweetId: uuidv1(),
        data: newTweet.data,
        ownerId: newTweet.ownerId,
        owner: newTweet.owner,
        retweet: { isRetweet: false, tweetId: null },
        likes: { count: 0, userId: [] },
        views: { count: 0, userId: [] },
        retweetCount: 0,
        replyCount: 0,
        replyTo: newTweet.replyTo ? newTweet.replyTo : null,
        hashTags: hashTags && _.isArray(hashTags) && hashTags.length > 0 ? hashTags : ["#general"]
    }).then(function (tweet) {
        return cb(null, {
            id: tweet.tweetId
        });

    }, function (err) {
        return cb(err);
    });
}


module.exports.getByOwnerId = function (ownerId, pagination, cb) {
    repository.Tweet.find({
        ownerId: ownerId,
        'active': true
    }, null,
        { ...pagination, sort: { 'createdAt': -1 } })
        .then(function (tweets) {
            return cb(null, {
                tweets: tweetMapper(tweets),
                nextOffset: (tweets.length <= pagination.limit) ? 0 : (pagination.limit) + (pagination.skip)
            });

        }, function (err) {
            return cb(err);
        });
}


module.exports.getByTweetId = function (tweetId, cb) {

    cache.get('tweet-getByTweetId-' + tweetId, function (err, tweet) {
        if (tweet) {
            return cb(null, JSON.parse(tweet));
        } else {
            repository.Tweet.findOne({
                tweetId: tweetId,
                'active': true
            })
                .then(function (tweet) {
                    if (tweet) {
                        var tweetDTO = tweetMapper(tweet);

                        cache.set('tweet-getByTweetId-' + tweetId, JSON.stringify(tweetDTO), function (err) {
                            if (err) {
                                console.log("Write to Cache Failed >>>> err: " + JSON.stringify(err, null, 4));
                            } else {
                                cache.expire('tweet-getByTweetId-' + tweetId, process.env.CACHE_EXPIRY_TIME);
                            }

                        })

                        repository.Tweet.findOneAndUpdate(
                            { tweetId: tweetId },
                            { $inc: { "views.count": 1 } }
                        ).then(function (tweet) {
                            console.log('viewed');
                        });

                        return cb(null, tweetDTO);
                    }
                    return cb({
                        code: 404,
                        message: "TWEET NOT FOUND"
                    });

                }, function (err) {
                    return cb(err);
                });
        }
    })
}


module.exports.likeTweet = function (userId, tweetId, cb) {
    let userId_arr = [];
    repository.Tweet.findOne({ tweetId: tweetId })
        .then(
            function (result) {
                userId_arr = result.likes.userId ? result.likes.userId : [];
                if (userId_arr.indexOf(userId) == -1) {
                    repository.Tweet.findOneAndUpdate(
                        { tweetId: tweetId },
                        { $inc: { "likes.count": 1 }, $push: { "likes.userId": userId } }
                    ).then(function (tweet) {
                        repository.Tweet.findOneAndUpdate(
                            { tweetId: tweetId },
                            { $inc: { "views.count": 1 } }
                        ).then(function (tweet) {
                            console.log('viewed');
                        });
                        return cb(null, "like incremented");
                    });
                }
                else {
                    return cb(null, "user already liked this tweet ");
                }
            }, function (err) {
                return cb(err);
            }
        );
}



//get tweetbyId and view count increment in one api/////
module.exports.viewTweet = function (userId, tweetId, cb) {
    let userId_arr = [];
    repository.Tweet.findOne({ tweetId: tweetId })
        .then(
            function (result) {
                userId_arr = result.views.userId;
                // if user is viewing the tweet 1st time
                if (userId_arr.indexOf(userId) == -1 && result.ownerId != userId) {
                    repository.Tweet.findOneAndUpdate(
                        { tweetId: tweetId },
                        { $inc: { "views.count": 1 } }
                    ).then(function (tweet) {
                        return cb(null, tweet);
                    });
                }
                // if user is viewing the tweet more than 1 time
                else {
                    return cb(null, result);
                }
            }, function (err) {
                return cb(err);
            }
        );
}


module.exports.bookmarkTweet = function (userId, tweetId, cb) {

    repository.Tweet.findOne({ tweetId: tweetId })
        .then(function (tweet) {
            repository.BookmarkedTweets.update(
                { "ownerId": Number(userId) },
                {
                    "$addToSet": { "bookMarkedTweets": tweet }
                },
                {
                    upsert: true
                }
            ).then(function (result) {
                repository.Tweet.findOneAndUpdate(
                    { tweetId: tweetId },
                    { $inc: { "views.count": 1 } }
                ).then(function (tweet) {
                    console.log('viewed');
                });
                return cb(null, "success");
            }, function (err) {
                return cb(err);
            })
        }, function (err) {
            return cb(err);
        });
}

module.exports.getBookmarks = function (userId, cb) {

    return repository.BookmarkedTweets.findOne(
        { "ownerId": Number(userId) },
    ).then(function (bookmark) {
        if (bookmark) {
            return cb(null, {
                tweets: tweetMapper(bookmark.bookMarkedTweets)
            });
        }
        return cb(null, {
            tweets: []
        })
    })

}


//insert into tweet collection with isRetweet true
module.exports.retweet = function (tweetId, reTweet, cb) {
    var hashTags = extractHashTags(reTweet.data);
    repository.Tweet.findOneAndUpdate({ tweetId: tweetId },
        { $inc: { "retweetCount": 1 } }
    ).then(function (tweet) {
        let obj = {
            tweetId: uuidv1(),
            data: reTweet.data,
            ownerId: reTweet.ownerId,
            owner: reTweet.owner,
            retweet: { isRetweet: true, tweetId: tweetId },
            likes: { count: 0, userId: [] },
            views: { count: 0, userId: [] },
            retweetCount: 0,
            replyCount: 0,
            replyTo: null,
            hashTags: hashTags && _.isArray(hashTags) && hashTags.length > 0 ? hashTags : ["#general"]
        }
        repository.Tweet.create(obj)
            .then(function (result) {

                repository.Tweet.findOneAndUpdate(
                    { tweetId: tweetId },
                    { $inc: { "views.count": 1 } }
                ).then(function (tweet) {
                    console.log('viewed');
                });
                return cb(null, result);
            }
            )
    }, function (err) {
        return cb(err);
    });
}

module.exports.reply = function (hostTweetId, replyTweet, cb) {
    repository.Tweet.findOneAndUpdate(
        { tweetId: hostTweetId },
        { $inc: { "replyCount": 1 } }
    ).then(function (tweet) {
        repository.Tweet.findOneAndUpdate(
            { tweetId: hostTweetId },
            { $inc: { "views.count": 1 } }
        ).then(function (tweet) {
            console.log('viewed');
        });
        console.log('reply count incremented');
    }, function (err) {
        console.log(err);
    });

    return module.exports.create({
        ...replyTweet,
        replyTo: hostTweetId
    }, cb);
}

module.exports.getReplies = function (tweetId, limit, offset, cb) {
    limit = limit ? Number(limit) : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? Number(offset) : 0;

    repository.Tweet.find({
        replyTo: tweetId
    },
        null,
        {
            sort: { 'createdAt': -1 },
            skip: offset,
            limit: limit
        }).then(function (tweets) {
            return cb(null, {
                tweets: tweetMapper(tweets),
                nextOffset: (tweets.length <= limit) ? 0 : (limit) + (offset)
            });
        }, function (err) {
            return cb(err);
        });
}

module.exports.getTweetsBySubscriber = function (userId, pagination, cb) {

    return User.findOne({
        where: {
            id: userId
        }
    }).then(function (user) {
        return user.getFollowees({
            attributes: ['id'],
            required: false
        }).then(followees => {
            var arr = followees.map(f => f.id);
            arr.push(userId);
            return repository.Tweet.find(
                {
                    "ownerId": { "$in": arr },
                    'active': true
                }, null, { ...pagination, sort: { 'createdAt': -1 } })
                .then(function (tweets) {
                    return cb(null, {
                        tweets: tweetMapper(tweets),
                        nextOffset: (tweets.length <= pagination.limit) ? 0 : (pagination.limit) + (pagination.skip)
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

module.exports.deleteTweet = function (tweetId, cb) {
    repository.Tweet.findOneAndRemove(
        { tweetId: tweetId }
    )
        .then(function (tweet) {
            return cb(null, tweet);
        }, function (err) {
            return cb(err);
        });
}

module.exports.getByList = function (listId, pagination, cb) {
    return List.findOne({
        where: {
            id: listId
        }
    }).then(function (list) {
        return list.getMembers({
            attributes: ['id'],
            required: false
        }).then(members => {
            var arr = members.map(f => f.id);
            return repository.Tweet.find(
                {
                    "ownerId": { "$in": arr },
                    'active': true
                }, null, { ...pagination, sort: { 'createdAt': -1 } })
                .then(function (tweets) {
                    return cb(null, {
                        tweets: tweetMapper(tweets),
                        nextOffset: (tweets.length <= pagination.limit) ? 0 : (pagination.limit) + (pagination.skip)
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

module.exports.getByHashtag = function (hashtag, pagination, cb) {
    repository.TweetsByHashtag.find({ "hashTags": { $regex: ".*" + searchKey + ".*", $options: 'i' } }, null, pagination)
        .then(function (tweets) {
            return cb(null, tweets.map(tweet => ({
                id: tweet.tweetId,
                likes: tweet.likes.count,
                views: tweet.views.count,
                replies: tweet.replies,
                retweetCount: tweet.retweetCount,
                data: tweet.data ? tweet.data : null,
                retweet: tweet.retweet,
                hashTags: tweet.hashTags
            })));

        }, function (err) {
            return cb(err);
        });
}


module.exports.getByLikedTweets = function (userId, pagination, cb) {
    repository.Tweet.find({ "likes.userId": userId }, null, pagination)
        .then(function (tweets) {
            return cb(null, tweets.map(tweet => ({
                id: tweet.tweetId,
                likes: tweet.likes.count,
                views: tweet.views.count,
                replies: tweet.replies,
                owner: tweet.owner,
                retweetCount: tweet.retweetCount,
                replyCount: tweet.replyCount,
                data: tweet.data ? tweet.data : null,
                retweet: tweet.retweet,
                hashTags: tweet.hashTags,
                createdAt: tweet.createdAt
            })));

        }, function (err) {
            return cb(err);
        });
}