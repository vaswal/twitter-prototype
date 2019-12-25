import React, { Component } from 'react';
import '../../css/hometweetlist.css'
import ViewTweets from "./ViewTweets";
import { getLikedTweets } from "../../redux/actions/tweetsActions";
import { connect } from "react-redux";

function mapStateToProps(store) {
    return {
        likedTweets: store.tweets.likedTweets,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getLikedTweets: (payload) => dispatch(getLikedTweets(payload))
    };
}

class LikedTweets extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const payload = {};
        payload.ownerId = localStorage.getItem("id")
        this.props.getLikedTweets(payload);
    }

    render() {
        console.log("render HomeTweetList");
        return (
            <div class="top-label-bookmark-header">
                <div class="top-label-bookmark">Liked tweets</div>
                <div class="bookmark-tweets-container">
                    <ViewTweets dataFromParent={this.props.likedTweets} />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LikedTweets);

