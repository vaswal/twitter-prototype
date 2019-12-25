const mongoose = require('mongoose');
const TweetSchema = require('./models/tweets');
const ReplySchema = require('./models/replies');
const ConversationSchema = require('./models/conversation');
const TweetsByHashtagSchema = require('./models/tweetsByHashtag');
const TweetsByListSchema = require('./models/tweetsByList');
const TweetsBySubscriptionSchema = require('./models/tweetsBySubscription');
const BookmarkedTweetsSchema = require('./models/bookmarkedTweets');
const UserAnalyticsSchema = require('./models/userAnalytics');

mongoose.connect(process.env.MONGO_URL);

const tweetModel = mongoose.model('tweets', TweetSchema);
const replyModel = mongoose.model('replies', ReplySchema);
const conversationModel = mongoose.model('conversation', ConversationSchema);
const tweetsByHashtagModel = mongoose.model('tweetsByHashtag', TweetsByHashtagSchema);
const tweetsByListModel = mongoose.model('tweetsByList', TweetsByListSchema);
const tweetsBySubscriptionModel = mongoose.model('tweetsBySubscription', TweetsBySubscriptionSchema);
const bookmarkedTweetsModel = mongoose.model('tweetsByBookmark', BookmarkedTweetsSchema);
const userAnalyticsModel = mongoose.model('userAnalytics', UserAnalyticsSchema);
/*
TODO
- tweets by HashTag  --- done
- tweets by User
- tweets by List  --- done
- tweets by Subscriptions --- done
- Bookmarked Tweets --done
*/

module.exports = {
    Tweet: tweetModel,
    Reply: replyModel,
    Conversation: conversationModel,
    TweetsByHashtag: tweetsByHashtagModel,
    TweetsByList: tweetsByListModel,
    TweetsBySubscription: tweetsBySubscriptionModel,
    BookmarkedTweets: bookmarkedTweetsModel,
    UserAnalytics: userAnalyticsModel,
    mongoose: mongoose
};