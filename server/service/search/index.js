const async = require('async');
const _ = require('lodash');
const { User, List, sequelize } = require('../../repository/mysql');
const { Tweet } = require('../../repository/mongo');

module.exports.listSearch = function( text, limit, offset, userId, cb ){
    var terms = Array.from(new Set([text].concat( text.trim().replace(/(\s)+/).split(' '))));
    if(!terms)
        return cb(null, []);
    
    if(!_.isArray(terms))
        terms = [terms];
    limit = limit ? Number(limit) : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? Number(offset) : 0;
    terms = terms.map(item => ({ $like: `%${item.toLowerCase()}%`}));
    List.findAll({
        where: {
            $and:[
                {
                    $or:[
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('name')),
                            {
                                $or:terms
                            }
                        ),
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('description')),
                            {
                                $or:terms
                            }
                        )                 
                    ]
                }
            ]
        },
        include:[
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'username', 'data']
            }
        ],
        order: [['createdAt', 'DESC']],
        offset,
        limit
    }).then(function(lists){
        if(lists && _.isArray(lists)){

            return User.findOne({
                where:{
                    id: userId?userId:-1
                }
            }).then(function(user){
                if(!user){
                    return cb(null, {
                        lists: lists.map(f => ({
                            id: f.id,
                            name: f.name,
                            description: f.description,
                            data: f.data,
                            owner: f.user,
                            subscribed: false
                        })),
                        nextOffset: (lists.length <= limit)? 0 : (limit) + (offset)
                    });
                }
                return user.getListsAsSubscriber({attributes: ['id']}).then(subscribedLists => {
                    subscribedLists = subscribedLists.map(f => f.id);
                    return cb(null, {
                        lists: lists.map(f => ({
                            id: f.id,
                            name: f.name,
                            description: f.description,
                            data: f.data,
                            owner: f.user,
                            subscribed: subscribedLists.includes(f.id)
                        })),
                        nextOffset: (lists.length <= limit)? 0 : (limit) + (offset)
                    });
                }, function(err){
                    return cb(err);
                })
            });
        }
        return cb(null, null);
    }, function(err){
        return cb(err);
    });
}

module.exports.userSearch = function( text, limit, offset, userId, cb ){
    var terms = Array.from(new Set([text].concat( text.trim().replace(/(\s)+/).split(' '))));
    if(!terms)
        return cb(null, []);
    
    if(!_.isArray(terms))
        terms = [terms];
    limit = limit ? Number(limit) : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? Number(offset) : 0;
    terms = terms.map(item => ({ $like: `%${item.toLowerCase()}%`}));
    User.findAll({
        where: {
            $and:[
                {
                    active: true
                },
                {
                    $or:[
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('firstName')),
                            {
                                $or:terms
                            }
                        ),
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('lastName')),
                            {
                                $or:terms
                            }
                        ),
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('username')),
                            {
                                $or:terms
                            }
                        ),
                        sequelize.where(
                            sequelize.fn('lower', sequelize.col('email')),
                            {
                                $or:terms
                            }
                        )                       
                    ]
                }
            ]
        },
        order: [['createdAt', 'DESC']],
        offset,
        limit
    }).then(function(users){
        if(users && _.isArray(users)){

            return User.findOne({
                where:{
                    id: userId?userId:-1
                }
            }).then(function(user){
                if(!user){
                    return cb(null, {
                        users: users.map(f => ({
                            id: f.id,
                            firstName: f.firstName,
                            lastName: f.lastName,
                            username: f.username,
                            data: f.data,
                            followed: false
                        })),
                        nextOffset: (users.length <= limit)? 0 : (limit) + (offset)
                    });
                }
                return user.getFollowees({attributes: ['id']}).then(followees => {
                    followees = followees.map(f => f.id);
                    return cb(null, {
                        users: users.map(f => ({
                            id: f.id,
                            firstName: f.firstName,
                            lastName: f.lastName,
                            username: f.username,
                            data: f.data,
                            followed: followees.includes(f.id)
                        })),
                        nextOffset: (users.length <= limit)? 0 : (limit) + (offset)
                    });
                }, function(err){
                    return cb(err);
                })
            });
        }
        return cb(null, null);
    }, function(err){
        return cb(err);
    });
}

module.exports.topicSearch = function( text , limit, offset, cb ){
    var terms = Array.from(new Set([text].concat( text.trim().replace(/(\s)+/).split(' '))));
    if(!terms)
        return cb(null, []);
    
    if(!_.isArray(terms))
        terms = [terms];
    limit = limit ? Number(limit) : Number(process.env.DEFAULT_PAGE_LIMIT);
    offset = offset ? Number(offset) : 0;
    
    terms = terms.map(item => (`((.*)${item.replace("#","")}(.*))`));
    var searchterm = terms.join('|');

    Tweet.find({
        hashTags: {
            $elemMatch:{
                $regex: searchterm,
                $options: 'i'
            }
        },
        'active':true
    },
    null,
    {
        sort: {'createdAt':-1},
        skip: offset,
        limit: limit
    }).then(function(tweets){
        if(tweets && _.isArray(tweets)){
            return cb(null, {
                tweets:tweets.map(tweet => ({
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
                })),
                nextOffset: (tweets.length < limit)? 0 : (limit) + (offset)
            });
        }
        return cb(null, null);
    }, function(err){
        return cb(err);
    });
}


module.exports.search = function(text, cb){

    var terms = text;

    var asyncTasks = {
        users: function(icb){
            return module.exports.userSearch(terms, icb);
        },
        lists: function(icb){
            return module.exports.listSearch(terms, icb);
        },
        topics: function(icb){
            return module.exports.topicSearch(terms, icb);
        }
    }

    return async.parallel(asyncTasks, function(err, results){
        if(err){
            return cb(err);
        }

        return cb(null, {
            users: results.users? results.users: [],
            lists: results.lists? results.lists: [],
            topics: results.topics? results.topics: []
        });

    });
}