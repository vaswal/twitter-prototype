const express = require('express');
const router = express.Router();
const Tweet = require('../routes/tweets');
const BookMarkedTweet = require('../routes/bookmarked-tweets');
const User = require('./users');
const Chat = require('./conversation');
const Analytics = require('./analytics');
const Search = require('./search');
const utils = require('../service/utils');
const User_producer = require('../kafka-producer').User;
const Tweet_producer = require('../kafka-producer').Tweet;
const List = require('./lists');
var passport = require('passport');
var auth = {
    userAuth: passport.authenticate('jwt', { session: false })
};

router.use(passport.initialize());
require('../auth/passport')(passport);

router.post('/img-upload', utils.uploadImage);

//USER APIS
router.post('/user/register', User.register);          ///tested
router.post('/user/login', User.login);                ///tested
router.get('/user/:id', auth.userAuth, User_producer.get);                     ///tested
router.put('/user/update', auth.userAuth, User.update);
router.put('/user/:id/follow', auth.userAuth, User.follow);           ///tested
router.put('/user/:id/unfollow', auth.userAuth, User.unfollow);       ///tested
router.get('/user/:id/followers', auth.userAuth, User.getFollowers);  ///tested
router.get('/user/:id/followees', auth.userAuth, User.getFollowees);  ///tested
router.get('/user/:id/subscriber/lists', auth.userAuth, User.getListsAsSubscriber);
router.get('/user/:id/member/lists', auth.userAuth, User.getListsAsMember);
router.get('/user/:id/owner/lists', auth.userAuth, User.getListsAsOwner);
router.put('/user/:id/deactivate', auth.userAuth, User.deactivate);
router.put('/user/:id/reactivate', auth.userAuth, User.reactivate);

//LIST APIS
router.post('/list/create', auth.userAuth, List.create); /// tested
router.get('/list/get/:id', auth.userAuth, List.get);
router.put('/list/:id/subscribe', auth.userAuth, List.subscribe);
router.put('/list/:id/unsubscribe', auth.userAuth, List.unsubscribe);
router.get('/list/:id/subscribers', auth.userAuth, List.getSubscribers);
router.put('/list/:id/add-member', auth.userAuth, List.addMember);
router.put('/list/:id/remove-member', auth.userAuth, List.removeMember);
router.get('/list/:id/members', auth.userAuth, List.getMembers);

// TWEET APIS
router.post('/tweet/create', auth.userAuth, Tweet.createTweet);                 ///tested
router.get('/tweet/byOwner/:ownerId', auth.userAuth, Tweet.getTweetsByOwnerId); ///tested
router.get('/tweet/byId/:tweetId', auth.userAuth, Tweet_producer.getTweetByTweetId);      ///tested
router.put('/tweet/:userId/like', auth.userAuth, Tweet.likeTweet);               ///tested
router.put('/tweet/:userId/view', auth.userAuth, Tweet.viewTweet);                ///tested 
router.post('/tweet/:tweetId/retweet', auth.userAuth, Tweet.retweet);             ///tested
router.post('/tweet/:id/reply', auth.userAuth, Tweet.reply);
router.get('/tweet/:id/replies', auth.userAuth, Tweet.getReplies);
router.delete('/tweet/:tweetId/delete', auth.userAuth, Tweet.deleteTweet);          ///tested       ///
router.get('/tweet/getByHashtag/:hashtag', auth.userAuth, Tweet.getByHashtag);     ///
router.get('/tweet/getByLikedTweets/:id', auth.userAuth, Tweet.getByLikedTweets);     ///


router.put('/user/:userId/bookmark-tweet/:tweetId', BookMarkedTweet.bookmarkTweet);
router.get('/user/:userId/bookmarks', BookMarkedTweet.getBookmarks);
router.get('/feed/user/:userId', auth.userAuth, Tweet.getTweetsBySubscriber);
router.get('/feed/list/:listId', auth.userAuth, Tweet.getTweetsByList);

// SEARCH APIS
router.get('/search/users', auth.userAuth, Search.userSearch);
router.get('/search/lists', auth.userAuth, Search.listSearch);
router.get('/search/topics', auth.userAuth, Search.topicSearch);



// ANALYTICS APIS
router.get('/analytics/user/:id/tweets/by-views', Analytics.topTweetsByViews);
router.get('/analytics/user/:id/tweets/by-likes', auth.userAuth, Analytics.topTweetsByLikes);
router.get('/analytics/user/:id/tweets/by-retweets', auth.userAuth, Analytics.topTweetsByRetweets);
router.get('/analytics/user/:id/tweets/count/hourly', auth.userAuth, Analytics.hourlyTweetCountPerDay);
router.get('/analytics/user/:id/tweets/count/daily', auth.userAuth, Analytics.dailyTweetCountPerWeek);
router.get('/analytics/user/:id/tweets/count/monthy', auth.userAuth, Analytics.monthlyTweetCountPerYear);
router.get('/analytics/user/:id/profile-views/daily', Analytics.dailyProfileViewsCountPerMonth);

//CONVERSATION APIS
router.get('/conversation/getByUser/:userId', Chat.getByUser);
router.get('/conversation/getMessages/:channel', Chat.getByChannel);


module.exports = router;