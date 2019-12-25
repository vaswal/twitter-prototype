import React, { Component } from 'react';
import TweetBody from "../HomeTweetList/listview";
import TweetButtons from "./TweetButtons";
import { connect } from "react-redux";
import { likeTweet, retweetTweet, bookmarkTweet } from "../../redux/actions/tweetsActions";

function mapStateToProps(store) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        likeTweet: (payload) => dispatch(likeTweet(payload)),
        retweetTweet: (payload) => dispatch(retweetTweet(payload)),
        bookmarkTweet: (payload) => dispatch(bookmarkTweet(payload)),
    };
}

class ViewSingleTweet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenCommentModal: false
        };

        this.likeTweet = this.likeTweet.bind(this);
        this.retweetTweet = this.retweetTweet.bind(this);
        this.bookmarkTweet = this.bookmarkTweet.bind(this);
    }


    retweetTweet(tweetData, owner, retweetingUserId, tweetId) {
        const retweet = {};
        retweet.isRetweet = true;
        retweet.tweetId = tweetId;

        const payload = {};
        payload.tweetId = tweetId;
        payload.data = tweetData;
        payload.owner = owner;
        payload.ownerId = retweetingUserId;

        this.props.retweetTweet(payload);
    }

    likeTweet(tweetId, userId) {
        const payload = {};
        payload.tweetId = tweetId;
        payload.userId = userId;

        this.props.likeTweet(payload);
    }

    bookmarkTweet(tweetId, userId) {
        const payload = {};
        payload.tweetId = tweetId;
        payload.userId = userId;

        this.props.bookmarkTweet(payload);
    }
    openCommentModal = e => {
        this.setState({ isOpenCommentModal: true });
    };

    closeCommentModal = e => {
        this.setState({ isOpenCommentModal: false });
    };

    render() {
        console.log("render HomeTweetList");
        let tweet = this.props.tweet;
        let tweetData = this.props.tweet;
        console.log(this.state);
        if (!tweetData) {
            return (null);
        }

        let dateObj = new Date(tweetData.createdAt);
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date1 = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        let date2 = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();

        console.log("ViewSingleTweet tweet")
        console.log(tweet)
        let id = tweet.id;
        let name = tweet.owner !== undefined ? `${tweet.owner.firstName} ${tweet.owner.lastName}` : "name";
        let handle = tweet.owner !== undefined ? `@${tweet.owner.username}` : "@username";
        let image = tweet.image;
        let tweetText = tweet.data.text;

        const buttonData = {};
        buttonData.tweetId = tweet.id;
        buttonData.userId = tweet.ownerId;
        buttonData.retweetCount = tweet.retweetCount;
        buttonData.likes = tweet.likes;
        buttonData.replyCount = tweet.replyCount ? tweet.replyCount : 0;
        buttonData.tweetData = tweet.data;

        const owner = {};
        owner["firstName"] = localStorage.getItem("firstName");
        owner["lastName"] = localStorage.getItem("lastName");
        owner["username"] = localStorage.getItem("username");
        owner["image"] = "";

        buttonData.owner = owner;
        buttonData.retweetingUserId = localStorage.getItem("id");

        return (
            <div>
                {this.props.isDisableButtons === true &&
                    <h5>Tweet {0}</h5>}

                <TweetBody
                    id={id}
                    key={0}
                    name={name}
                    handle={handle}
                    tweet=""
                    image={image}
                />
                <div className="tweet-details">
                    <div className="tweet-text">
                        {tweetData.data.text}
                    </div>
                    <div className="tweet-date">
                        {
                            date1
                        } &#8226;&nbsp;
                            {
                            date2
                        }
                    </div>
                </div>
                {this.props.isDisableButtons !== true &&
                    <TweetButtons data={buttonData}
                        likeTweetCallback={this.likeTweet}
                        retweetTweetCallback={this.retweetTweet}
                        replyTweetCallback={this.replyTweetCallback}
                        bookmarkCallback={this.bookmarkTweet} />}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewSingleTweet);