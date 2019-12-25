import React, { Component } from 'react';
import { PullDownContent, PullToRefresh, RefreshContent, ReleaseContent } from "react-js-pull-to-refresh";
import TweetBody from "../HomeTweetList/listview";
import TweetButtons from "../Tweet/TweetButtons";
import { connect } from "react-redux";
import { likeTweet, retweetTweet, bookmarkTweet, deleteTweet } from "../../redux/actions/tweetsActions";

function mapStateToProps(store) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        likeTweet: (payload) => dispatch(likeTweet(payload)),
        retweetTweet: (payload) => dispatch(retweetTweet(payload)),
        bookmarkTweet: (payload) => dispatch(bookmarkTweet(payload)),
        deleteTweet: (payload) => dispatch(deleteTweet(payload)),
    };
}

class ViewTweets extends Component {
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

    deleteTweet = (tweetId) => {
        const payload = {};
        payload.tweetId = tweetId;

        this.props.deleteTweet(payload);
    }

    getCreatedAt = (tweet) => {
        if (!tweet.createdAt) {
            return undefined;
        }

        let dateObj = new Date(tweet.createdAt);
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date1 = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        let date2 = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();

        return <div>{
            date1
        } &#8226;&nbsp;
            {
                date2
            }</div>;
    }

    render() {
        console.log("render HomeTweetList");
        return (
            <PullToRefresh
                pullDownContent={<PullDownContent />}
                releaseContent={<ReleaseContent />}
                refreshContent={<RefreshContent />}
                pullDownThreshold={2}
                triggerHeight={50}>
                <div className="main-body">
                    {console.log("this.props.dataFromParent123", this.props.dataFromParent)}
                    {this.props.dataFromParent !== undefined && this.props.dataFromParent.map((tweet, index) => {
                        console.log("tweet" + index)
                        console.log(tweet)
                        let name = tweet.owner !== undefined ? `${tweet.owner.firstName} ${tweet.owner.lastName}` : "name";
                        let handle = tweet.owner !== undefined ? `@${tweet.owner.username}` : "@username";
                        let image = tweet.owner.image;
                        let tweetText = tweet.data.text;
                        let isRetweeted = tweet.retweet ? tweet.retweet.isRetweet : false;

                        // let dateObj = new Date(tweet.createdAt);
                        // let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        // let date1 = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                        // let date2 = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
                        //
                        // let createdAt = <div>{
                        //     date1
                        // } &#8226;&nbsp;
                        //     {
                        //         date2
                        //     }</div>;
                        const createdAt = this.getCreatedAt(tweet);

                        let id = tweet.id;
                        const buttonData = {};
                        buttonData.tweetId = tweet.id;
                        buttonData.userId = tweet.ownerId;
                        buttonData.retweetCount = tweet.retweetCount;
                        buttonData.likes = tweet.likes;
                        buttonData.replyCount = tweet.replyCount;
                        buttonData.tweetData = tweet.data;

                        const owner = {};
                        owner["firstName"] = localStorage.getItem("firstName");
                        owner["lastName"] = localStorage.getItem("lastName");
                        owner["username"] = localStorage.getItem("username");
                        owner["image"] = localStorage.getItem("image");

                        buttonData.owner = owner;
                        buttonData.retweetingUserId = localStorage.getItem("id");

                        return (
                            <div>
                                {this.props.isDisableButtons === true &&
                                    <h5>Tweet {index + 1}</h5>}

                                <TweetBody
                                    id={id}
                                    key={index}
                                    name={name}
                                    handle={handle}
                                    tweet={tweetText}
                                    image={image}
                                    createdAt={createdAt}
                                    isRetweeted={isRetweeted}
                                    setTweet={this.props.setTweet ? this.props.setTweet : false}
                                />

                                {tweet.data.image &&
                                    <div className="profile-cover-pic row">
                                    <img
                                        src={tweet.data.image}
                                        width="100%"
                                        height="200px"
                                    />
                                </div>}

                                {this.props.isDisableButtons !== true &&
                                    <TweetButtons data={buttonData}
                                        likeTweetCallback={this.likeTweet}
                                        retweetTweetCallback={this.retweetTweet}
                                        bookmarkCallback={this.bookmarkTweet}
                                        deleteTweetCallback={this.deleteTweet}
                                    />}
                            </div>
                        )
                    })}
                </div>
            </PullToRefresh>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewTweets);