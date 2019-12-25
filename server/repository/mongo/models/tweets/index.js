const Schema = require('mongoose').Schema;
const replySchema = require('../replies');

const TweetSchema = new Schema({
	tweetId: {
		type: String,
		required: true
	},
	data: {
		type: Schema.Types.Mixed,
		required: true
	},
	active: {
		type: Boolean,
		default: true
	},
	ownerId: {
		type: Number,
		required: true
	},
	owner: {
		firstName: String,
		lastName: String,
		username: String,
		image: String
	},
	retweet: {
		isRetweet: Boolean,
		tweetId: {
			type: String
		}
	},
	retweetCount: Number,
	likes: {
		count: Number,
		userId: [Number]
	},
	views: {
		count: Number,
		userId: [Number]
	},
	replyTo: String,
	replyCount: Number,
	hashTags: [
		String
	]

}, {
	timestamps: true
});

module.exports = TweetSchema;
