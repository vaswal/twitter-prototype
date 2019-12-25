import React, { Component } from 'react';
import '../../css/hometweetlist.css'
import ViewTweets from "./ViewTweets";
import { getBookmarkedTweets } from "../../redux/actions/tweetsActions";
import { connect } from "react-redux";

function mapStateToProps(store) {
    return {
        bookmarkedTweets: store.tweets.bookmarkedTweets,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getBookmarkedTweets: (payload) => dispatch(getBookmarkedTweets(payload))
    };
}

class BookMarkedTweets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            userName: "@sakshimahendru",
            openCommentModal: false
        };
    }

    componentDidMount() {
        const payload = {};
        payload.ownerId = localStorage.getItem("id")
        this.props.getBookmarkedTweets(payload);
    }

    render() {
        console.log("render HomeTweetList: ", this.props);
        return (
            <div class="top-label-bookmark-header">
                <div class="top-label-bookmark">BookMarks</div>
                <div class="top-label-bookmark-username">{this.props.username ? this.props.username : ""}</div>
                <div class="bookmark-tweets-container">
                    <ViewTweets dataFromParent={this.props.bookmarkedTweets} />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookMarkedTweets);

