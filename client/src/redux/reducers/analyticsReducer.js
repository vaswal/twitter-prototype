import {
    GET_TOP_TEN_TWEETS_BY_VIEWS,
    GET_TOP_TEN_TWEETS_BY_LIKES,
    GET_TOP_TEN_TWEETS_BY_RETWEETS,
    GET_NUMBER_OF_HOURLY_TWEETS,
    GET_NUMBER_OF_MONTHLY_TWEETS,
    GET_NUMBER_OF_DAILY_TWEETS,
    GET_PROFILE_VIEW_DATA
} from "../constants/actionTypes";
import React from "react";

const initialState = {
    topTenTweetsByViews: [],
    topTenTweetsByLikes: [],
    topTenTweetsByRetweets: [],
    numberOfHourlyTweets: [],
    numberOfDailyTweets: [],
    numberOfMonthlyTweets: [],
    profileViewData: []
};

export default function getTopTenTweetsByViews(state = initialState, action) {
    console.log("action.payload");
    console.log(action.payload);

    if (action.type === GET_TOP_TEN_TWEETS_BY_VIEWS) {
        const tweets = action.payload.data.res.map((tweet) => {
            const tweetCustom = {};
            tweetCustom.data = tweet.tweet.data;

            const owner = {};
            owner["firstName"] = localStorage.getItem("firstName");
            owner["lastName"] = localStorage.getItem("lastName");
            owner["username"] = localStorage.getItem("username");

            tweetCustom.owner = owner;
            tweetCustom.createdAt = tweet.createdAt;

            return tweetCustom;
        });

        const dataPoints = action.payload.data.res.map((tweet, index) => {
            const yxValues = {};

            yxValues["y"] = tweet.numOfViews;
            yxValues["label"] = "Tweet " + (index + 1);
            return yxValues;
        });

        console.log("GET_TOP_TEN_TWEETS_BY_VIEWS tweets", tweets)
        const response = {};
        response.tweets = tweets;
        response.dataPoints = dataPoints;

        return Object.assign({}, state, {
            topTenTweetsByViews: response
        });
    } else if (action.type === GET_TOP_TEN_TWEETS_BY_LIKES) {
        const tweets = action.payload.data.res.map((tweet) => {
            const tweetCustom = {};
            tweetCustom.data = tweet.tweet.data;

            const owner = {};
            owner["firstName"] = localStorage.getItem("firstName");
            owner["lastName"] = localStorage.getItem("lastName");
            owner["username"] = localStorage.getItem("username");

            tweetCustom.owner = owner;

            return tweetCustom;
        });

        const dataPoints = action.payload.data.res.map((tweet, index) => {
            const yxValues = {};

            yxValues["y"] = tweet.numOfLikes;
            yxValues["label"] = "Tweet " + (index + 1);
            return yxValues;
        });

        const response = {};
        response.tweets = tweets;
        response.dataPoints = dataPoints;

        return Object.assign({}, state, {
            topTenTweetsByLikes: response
        });
    } else if (action.type === GET_TOP_TEN_TWEETS_BY_RETWEETS) {
        const tweets = action.payload.data.res.map((tweet) => {
            const tweetCustom = {};

            tweetCustom.data = tweet.tweet.data;

            const owner = {};
            owner["firstName"] = localStorage.getItem("firstName");
            owner["lastName"] = localStorage.getItem("lastName");
            owner["username"] = localStorage.getItem("username");

            tweetCustom.owner = owner;

            return tweetCustom;
        });

        const dataPoints = action.payload.data.res.map((tweet, index) => {
            const yxValues = {};

            yxValues["y"] = tweet.tweet.retweetCount;
            yxValues["label"] = "Tweet " + (index + 1);
            return yxValues;
        });

        console.log("GET_TOP_TEN_TWEETS_BY_RETWEETS dataPoints", dataPoints)

        const response = {};
        response.tweets = tweets.slice(0, 5);
        response.dataPoints = dataPoints.slice(0, 5);

        return Object.assign({}, state, {
            topTenTweetsByRetweets: response,
        });
    } else if (action.type === GET_NUMBER_OF_HOURLY_TWEETS) {
        return Object.assign({}, state, {
            numberOfHourlyTweets: action.payload.data.res.map((pair, index) => {
                const keys = Object.keys(pair);

                const yxValues = {};

                yxValues["y"] = pair[keys[0]];
                yxValues["label"] = keys[0];
                return yxValues;
            })
        });
    } else if (action.type === GET_NUMBER_OF_DAILY_TWEETS) {
        return Object.assign({}, state, {
            numberOfDailyTweets: action.payload.data.res.map((pair, index) => {
                console.log("GET_NUMBER_OF_DAILY_TWEETS pair", pair)
                const keys = Object.keys(pair);
                console.log("key", keys)

                const yxValues = {};

                yxValues["y"] = pair[keys[0]];
                yxValues["label"] = keys[0];
                return yxValues;
            })
        });
    } else if (action.type === GET_NUMBER_OF_MONTHLY_TWEETS) {
        return Object.assign({}, state, {
            numberOfMonthlyTweets: action.payload.data.res.map((pair, index) => {
                console.log("GET_NUMBER_OF_MONTHLY_TWEETS pair", pair)
                const keys = Object.keys(pair);
                console.log("key", keys)

                const yxValues = {};

                yxValues["y"] = pair[keys[0]];
                yxValues["label"] = keys[0];
                return yxValues;
            })
        });
    } else if (action.type === GET_PROFILE_VIEW_DATA) {
        return Object.assign({}, state, {
            profileViewData: action.payload.data.res.map((pair, index) => {
                console.log("GET_PROFILE_VIEW_DATA pair", pair)
                const keys = Object.keys(pair);
                console.log("key", keys)

                const yxValues = {};

                yxValues["y"] = pair[keys[0]];
                yxValues["label"] = keys[0];
                return yxValues;
            })
        });
    }



    return state;
}