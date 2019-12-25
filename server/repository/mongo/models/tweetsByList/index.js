const Schema = require('mongoose').Schema;
const tweetSchema = require('../tweets');

const TweetByListSchema = new Schema({
    listId: Number,
    tweets: [tweetSchema]
}, {
    timestamps: true
});

module.exports = TweetByListSchema;
