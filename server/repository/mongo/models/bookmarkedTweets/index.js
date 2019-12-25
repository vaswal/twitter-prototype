const Schema = require('mongoose').Schema;
const tweetSchema = require('../tweets');

const BookMarkedTweetSchema = new Schema({
    ownerId: Number,
    bookMarkedTweets: [tweetSchema]
}, {
    timestamps: true
});

module.exports = BookMarkedTweetSchema;
