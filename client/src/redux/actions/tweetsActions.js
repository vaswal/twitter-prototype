import { CREATE_TWEET, GET_USER_TWEETS, LIKE_TWEET, RETWEET_TWEET, REPLY_TWEET, BOOKMARK_TWEET, GET_BOOKMARKED_TWEETS, DELETE_TWEET, GET_LIKED_TWEETS } from "../../redux/constants/actionTypes";
import { HOSTNAME } from "../../constants/appConstants";
import axios from 'axios';
var headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token")
};
export function createTweet(payload) {

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:8080/api/v1/tweet/create`, payload, { headers: headers })
            .then((response) => dispatch(createTweetDispatch(response.data)));
    }
}

export function retweetTweet(payload) {

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:8080/api/v1/tweet/${payload.tweetId}/retweet`, payload, { headers: headers })
            .then((response) => dispatch(likeTweetDispatch(response.data)))
            .catch(err => {
                console.log(err)
            });;
    }
}

export function likeTweet(payload) {

    return (dispatch) => {
        axios.put(`http://${HOSTNAME}:8080/api/v1/tweet/${payload.userId}/like`, payload, { headers: headers })
            .then((response) => dispatch(retweetTweetDispatch(response.data)));
    }
}

export function replyTweet(payload) {

    return (dispatch) => {
        axios.post(`http://${HOSTNAME}:8080/api/v1/tweet/${payload.tweetId}/reply`, payload, { headers: headers })
            .then((response) => dispatch(replyTweetDispatch(response.data)));
    }
}

export function bookmarkTweet(payload) {

    return (dispatch) => {
        axios.put(`http://${HOSTNAME}:8080/api/v1/user/${payload.userId}/bookmark-tweet/${payload.tweetId}`)
            .then((response) => dispatch(bookmarkTweetDispatch(response.data)));
    }
}

export function getLikedTweets(payload) {


    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/tweet/getByLikedTweets/${payload.ownerId}`, { headers: headers })
            .then((response) => dispatch(getLikedTweetsDispatch(response.data)));
    }
}

export function getTweetsById(data) {
    return function (dispatch) {
        // var headers = {
        //     "Content-Type": "application/json",
        //     Authorization:localStorage.getItem("token")
        // };
        axios.defaults.withCredentials = true;
        axios
            .get(`http://${HOSTNAME}:8080/api/v1/tweet/byOwner/` + data.user_id, { headers: headers })
            .then(response => dispatch(getUserTweets(response)))
            .catch(err => { console.log(err); });
    };
}

export function getBookmarkedTweets(payload) {


    return (dispatch) => {
        axios.get(`http://${HOSTNAME}:8080/api/v1/user/${payload.ownerId}/bookmarks`)
            .then((response) => dispatch(getBookmarkedTweetsDispatch(response.data)));
    }
}

export function deleteTweet(payload) {


    return (dispatch) => {
        axios.delete(`http://${HOSTNAME}:8080/api/v1/tweet/${payload.tweetId}/delete`, { headers: headers })
            .then((response) => dispatch(deleteTweetDispatch(response.data)));
    }
}

function getUserTweets(returndata) {

    return { type: GET_USER_TWEETS, payload: returndata };
}

export const createTweetDispatch = (returnData) => {


    return { type: CREATE_TWEET, payload: returnData }
};

export const retweetTweetDispatch = (returnData) => {


    return { type: RETWEET_TWEET, payload: returnData }
};

export const likeTweetDispatch = (returnData) => {

    return { type: LIKE_TWEET, payload: returnData }
};

export const replyTweetDispatch = (returnData) => {


    return { type: REPLY_TWEET, payload: returnData }
};

export const bookmarkTweetDispatch = (returnData) => {

    return { type: BOOKMARK_TWEET, payload: returnData }
};

export const getBookmarkedTweetsDispatch = (returnData) => {

    return { type: GET_BOOKMARKED_TWEETS, payload: returnData }
};

export const deleteTweetDispatch = (returnData) => {

    return { type: DELETE_TWEET, payload: returnData }
};

export const getLikedTweetsDispatch = (returnData) => {

    return { type: GET_LIKED_TWEETS, payload: returnData }
};
