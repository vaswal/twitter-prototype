const Schema = require('mongoose').Schema;
const tweetSchema = require('../tweets');

const TweetBySubscriptionSchema = new Schema({
    userId: Number,
    tweets: [tweetSchema]
}, {
    timestamps: true
});

module.exports = TweetBySubscriptionSchema;
