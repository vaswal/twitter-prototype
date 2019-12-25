import React, { Component } from "react";
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import './ViewTweetDetails.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faImage, faRetweet, faShareSquare, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal } from "react-bootstrap";
import CreateTweet from "../Tweet/CreateTweet";
import ViewTweets from '../Tweet/ViewTweets';
import ViewSingleTweet from "../Tweet/ViewSingleTweet";
import { HOSTNAME } from "../../constants/appConstants";

const Image = (props) => {
    return (
        <img src={props.image} alt="" className="picture">
        </img>
    )
};

const Handle = (props) => {
    return (
        <div className="handle">
            {props.handle}
        </div>
    )
};

const Name = (props) => {
    return (
        <div className="name">
            {props.name}
        </div>
    )
};

const Tweet = (props) => {
    return (
        <div className="tweet">
            {props.tweet}
        </div>
    )
};


class ViewTweetDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectToTweet: false,
            replies: [],
            isOpenCommentModal: false
        }

    }

    getReplies = (id) => {
        console.log("In get reply");
        var headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        };
        axios.get(`http://${HOSTNAME}:8080/api/v1/tweet/${id}/replies`, { headers: headers })
            .then(response => {
                console.log(response);
                this.setState(
                    {
                        "replies": response.data.data.tweets  // What??
                    }
                );
            })
            .catch(err => {
                console.error(err);
            });
    }

    getTweet = (id) => {
        console.log("this works");

        try {
            let tweetId = id//document.querySelector("#root > div > div > div > div > div.col-lg-3 > div > div > div > button:nth-child(7)").getAttribute("data-tweet-id");
            console.log(">>>>>>>>>> id ", tweetId);
            this.setState({
                tweetId
            }, () => {
                axios.defaults.withCredential = true;
                let channel = '1|2';
                let firstName = localStorage.getItem('firstName');
                var headers = {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token")
                };
                axios.get(`http://${HOSTNAME}:8080/api/v1/tweet/byId/${tweetId}`, { headers: headers })
                    .then(response => {
                        console.log("tweet/byId response", response);
                        this.setState(
                            {
                                "data": response.data.data  // What??
                            }
                        );
                        this.getReplies(tweetId);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });

        }
        catch (e) {
            console.log(e);
        }
    }

    componentDidMount() {
        console.log("this works");

        this.getTweet(this.props.tweetId);


    }



    goBackToFeeds() {
        console.log("back");
        try {
            document.querySelector("#root > div > div > div > div > div.col-lg-3 > div > div > div > button.list-group-item.list-group-item-action.borderless.sidebar-button").click();
        }
        catch (e) {
            console.log(e);
        }
    }


    render() {
        let tweetData = this.state.data;
        console.log("ViewTweetDetails tweetData", tweetData)
        let tweetReplies = this.state.replies;
        console.log(this.state);
        if (!tweetData) {
            return (null);
        }

        let dateObj = new Date(tweetData.createdAt);
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date1 = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        let date2 = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();

        console.log(tweetData);
        return (

            tweetData.data ? (<div class="list-group">
                <div className="list-group-item list-group-item-action display-tweet" style={{ "display": "block" }}>
                    <div className="tweet-header" onClick={this.goBackToFeeds}>
                        <FontAwesomeIcon icon={faLongArrowAltLeft} /> Tweet
                    </div>

                    <ViewSingleTweet tweet={tweetData} />

                    <div class="reply-box">
                        <ViewTweets dataFromParent={tweetReplies} setTweet={this.getTweet} />
                        {/* {
                                tweetReplies.map((tweet) => {
                                    return (
                                        <div className="reply">
                                            <button type="button" className="inner-body list-group-item list-group-item-action" onClick={(e) => this.displayTweet()}>
                                                <Image image={tweetData.owner.image ? tweetData.owner.image : null} />
                                                <div className="body">
                                                    <div className="inner-body-inner">
                                                        <Name name={tweet.owner.firstName} />
                                                        <Handle handle={tweet.owner.username} />
                                                    </div>
                                                    <Tweet tweet={tweet.data.text} />
                                                </div>
                                            </button>
                                            <div style={styles.container}>
                                                <button
                                                    type="button"
                                                    className="list-group-item list-group-item-action borderless"
                                                    style={styles.reply}
                                                    onClick={this.openCommentModal}
                                                >
                                                    <FontAwesomeIcon icon={faComment} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="list-group-item list-group-item-action borderless"
                                                    style={styles.retweet}
                                                >
                                                    <FontAwesomeIcon icon={faRetweet} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="list-group-item list-group-item-action borderless"
                                                    style={styles.like}
                                                >
                                                    <FontAwesomeIcon icon={faHeart} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="list-group-item list-group-item-action borderless"
                                                    style={styles.share}
                                                >
                                                    <FontAwesomeIcon icon={faShareSquare} />
                                                </button>

                                                <Modal
                                                    show={this.state.isOpenCommentModal}
                                                    onHide={this.closeCommentModal}
                                                    animation={false}
                                                >
                                                    <CreateTweet />
                                                </Modal>
                                            </div>
                                        </div>
                                    )
                                })
                            } */}

                    </div>



                </div>


            </div>

            ) : null
        )
    }

}

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        "margin-left": 65,
        "margin-right": 10
    },
    reply: {
        //alignItems: "left",
    },
    retweet: {
        //alignItems: "center",
    },
    like: {
        //alignItems: "center",
    },
    share: {
        //alignItems: "right",
    }
};


export default ViewTweetDetails;