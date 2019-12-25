import { CREATE_TWEET, GET_USER_TWEETS, GET_BOOKMARKED_TWEETS, GET_LIKED_TWEETS } from "../../redux/constants/actionTypes";

const initialState = {
    createTweetSuccess: null,
    createTweetMessage: null,
    userTweets: [],
    bookmarkedTweets: [],
    likedTweets: []
};

function generateTweets(tweets) {
    console.log("generateTweets")
    console.log(tweets)

    const userTweetsArray = [];

    for (const tweet of tweets.tweets) {
        const tweetCustom = {};
        tweetCustom.name = localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
        tweetCustom.tweet = tweet.data.text;

        userTweetsArray.push(tweetCustom);
    }

    console.log("userTweetsArray")
    console.log(userTweetsArray)
}

export default function tweetReducer(state = initialState, action) {
    console.log("action.payload");
    console.log(action.payload);

    if (action.type === CREATE_TWEET) {
        return Object.assign({}, state, {
            createTweetSuccess: action.payload.signinSuccess,
            createTweetMessage: action.payload.signinMessage,
        });
    } else if (action.type === GET_USER_TWEETS) {
        const gottweets = generateTweets(action.payload.data.data);
        console.log("gottweets");
        console.log(gottweets);
        const userTweetsArray = [];

        return Object.assign({}, state, {
            userTweets: action.payload.data.data.tweets
            // userTweets: action.payload.data.data.tweets.map((tweet, index) => {
            //     const tweetCustom = {};
            //     tweetCustom.tweetId = tweet.id;
            //     tweetCustom.userId = localStorage.getItem("id");
            //     tweetCustom.name = localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
            //     tweetCustom.tweet = tweet.data.text;
            //     tweetCustom.likes = tweet.likes;
            //     tweetCustom.retweetCount = tweet.retweetCount;
            //     return tweetCustom;
            // })
        });
    } else if (action.type === GET_BOOKMARKED_TWEETS) {
        return Object.assign({}, state, {
            bookmarkedTweets: action.payload.data.tweets
        })
    } else if (action.type === GET_LIKED_TWEETS) {
        return Object.assign({}, state, {
            likedTweets: action.payload.data
        })
    }

    return state;
}