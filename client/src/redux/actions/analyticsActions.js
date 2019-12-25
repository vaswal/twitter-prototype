import {
    GET_TOP_TEN_TWEETS_BY_VIEWS, GET_TOP_TEN_TWEETS_BY_LIKES, GET_TOP_TEN_TWEETS_BY_RETWEETS,
    GET_NUMBER_OF_HOURLY_TWEETS, GET_NUMBER_OF_DAILY_TWEETS, GET_NUMBER_OF_MONTHLY_TWEETS, GET_PROFILE_VIEW_DATA
}
    from "../../redux/constants/actionTypes";
import { HOSTNAME } from "../../constants/appConstants";
import axios from 'axios';

var headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token")
};
export function getTopTenTweetsByViews(payload) {
    console.log("getTop10TweetsByView payload");
    console.log(payload);

    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/analytics/user/${payload.ownerId}/tweets/by-views`, { headers: headers })
            .then((response) => dispatch(getTopTenTweetsByViewsDispatch(response.data)));
    }
}

export function getTopTenTweetsByLikes(payload) {
    console.log("getTop10TweetsByView payload");
    console.log(payload);

    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/analytics/user/${payload.ownerId}/tweets/by-likes`, { headers: headers })
            .then((response) => dispatch(getTopTenTweetsByLikesDispatch(response.data)));
    }
}

export function getTopTenTweetsByRetweets(payload) {
    console.log("getTopTenTweetsByRetweets payload");
    console.log(payload);

    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/analytics/user/${payload.ownerId}/tweets/by-retweets`, { headers: headers })
            .then((response) => dispatch(getTopTenTweetsByRetweetsDispatch(response.data)));
    }
}

export function getNumberOfHourlyTweets(payload) {
    console.log("getTop10TweetsByView payload");
    console.log(payload);

    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/analytics/user/${payload.ownerId}/tweets/count/hourly`, { headers: headers })
            .then((response) => dispatch(getNumberOfHourlyTweetsDispatch(response.data)));
    }
}

export function getNumberOfDailyTweets(payload) {
    console.log("getTop10TweetsByView payload");
    console.log(payload);

    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/analytics/user/${payload.ownerId}/tweets/count/daily`, { headers: headers })
            .then((response) => dispatch(getNumberOfDailyTweetsDispatch(response.data)));
    }
}

export function getNumberOfMonthlyTweets(payload) {
    console.log("getTop10TweetsByView payload");
    console.log(payload);

    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/analytics/user/${payload.ownerId}/tweets/count/monthy`, { headers: headers })
            .then((response) => dispatch(getNumberOfMonthlyTweetsDispatch(response.data)));
    }
}

export function getProfileViewData(payload) {
    console.log("getTop10TweetsByView payload");
    console.log(payload);

    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/analytics/user/${payload.ownerId}/profile-views/daily`, { headers: headers })
            .then((response) => dispatch(getProfileViewDataDispatch(response.data)));
    }
}

export const getTopTenTweetsByViewsDispatch = (returnData) => {
    console.log("Inside getTop10TweetsByViewDispatch dispatch");
    console.log(returnData);
    return { type: GET_TOP_TEN_TWEETS_BY_VIEWS, payload: returnData }
};

export const getTopTenTweetsByLikesDispatch = (returnData) => {
    console.log("Inside getTop10TweetsByViewDispatch dispatch");
    console.log(returnData);
    return { type: GET_TOP_TEN_TWEETS_BY_LIKES, payload: returnData }
};

export const getTopTenTweetsByRetweetsDispatch = (returnData) => {
    console.log("Inside getTopTenTweetsByRetweetsDispatch ");
    console.log(returnData);
    return { type: GET_TOP_TEN_TWEETS_BY_RETWEETS, payload: returnData }
};

export const getNumberOfHourlyTweetsDispatch = (returnData) => {
    console.log("Inside getNumberOfHourlyTweetsDispatch ");
    console.log(returnData);
    return { type: GET_NUMBER_OF_HOURLY_TWEETS, payload: returnData }
};

export const getNumberOfDailyTweetsDispatch = (returnData) => {
    console.log("Inside getNumberOfDailyTweetsDispatch ");
    console.log(returnData);
    return { type: GET_NUMBER_OF_DAILY_TWEETS, payload: returnData }
};

export const getNumberOfMonthlyTweetsDispatch = (returnData) => {
    console.log("Inside getNumberOfMonthlyTweetsDispatch ");
    console.log(returnData);
    return { type: GET_NUMBER_OF_MONTHLY_TWEETS, payload: returnData }
};

export const getProfileViewDataDispatch = (returnData) => {
    console.log("Inside getNumberOfMonthlyTweetsDispatch ");
    console.log(returnData);
    return { type: GET_PROFILE_VIEW_DATA, payload: returnData }
};

