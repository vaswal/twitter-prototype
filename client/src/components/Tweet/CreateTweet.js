import React, { Component } from 'react';
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { createTweet } from "../../redux/actions/tweetsActions";
import "./tweets.css"
import axios from "axios";
import { HOSTNAME } from "../../constants/appConstants";

function mapStateToProps(store) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        createTweet: (payload) => dispatch(createTweet(payload))
    };
}

class CreateTweet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTweetImage: null,
        };
    }

    image = () => {
        return (
            <img src={require("../../static/images/profile_pic.png")} alt="Logo" className="profile-pic" />
        )
    };

    createTweet = (e) => {
        e.preventDefault();

        const data = {};
        for (let i = 0; i < e.target.length; i++) {
            if (e.target[i].id !== "") {
                if (e.target[i].id === "img-upload") {
                    continue;
                }

                data[e.target[i].id] = e.target[i].value;
            }
        }

        const owner = {};
        owner["firstName"] = localStorage.getItem("firstName");
        owner["lastName"] = localStorage.getItem("lastName");
        owner["username"] = localStorage.getItem("username");
        owner["image"] = localStorage.getItem("image") ? localStorage.getItem("image") : "";

        const tweet = {}
        tweet["data"] = data;
        tweet["ownerId"] = localStorage.getItem("id");
        tweet["owner"] = owner;
        tweet["retweet"] = [];
        tweet["hashTags"] = [];

        console.log("createTweet payload");
        console.log(tweet);

        const formData = new FormData();
        console.log("testing image state:", this.state.selectedTweetImage);
        if (this.state.selectedTweetImage) {
            console.log("inside if condition");
            formData.append('image', this.state.selectedTweetImage, this.state.selectedTweetImage.name);
            axios.post(`http://${HOSTNAME}:8080/api/v1/img-upload`, formData, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
                    // 'Authorization': localStorage.getItem('token')
                }
            }).then((response) => {
                tweet["data"] = { ...tweet["data"], image: response.data.location };

                console.log("testing data with image:", tweet);
                this.props.createTweet(tweet);
            })
        } else {
            console.log("XXX Insisde else")
            tweet["data"] = { ...tweet["data"], image: null };
            this.props.createTweet(tweet);
        }
    };

    onSelectingImage = (e) => {
        this.setState({
            selectedTweetImage: e.target.files[0]
        }, () => {
            console.log("selectedTweetImage", this.state.selectedTweetImage)
        });
    }

    render() {
        return (
            <div style={{ padding: 10 }}>
                <Form onSubmit={this.createTweet}>
                    <div>
                        <Form.Row>
                            <div style={styles.profileImage}> {this.image()}</div>

                            <div style={styles.tweetTextBox}>
                                <textarea
                                    class="form-control text-area"
                                    id="text"
                                    placeholder="Tweet your reply"
                                    rows="3"
                                    maxlength="280"
                                ></textarea>
                                {/* <Form.Group controlId="formGridAddress1">
                                    <Form.Control as="textarea" row="3" placeholder="Tweet your reply" />
                                </Form.Group> */}
                            </div>
                        </Form.Row>
                    </div>

                    <div style={{ marginTop: 40 }}>
                        <Form.Row>
                            <div className="image-icon">
                                <input
                                    className="image-btn"
                                    type="file"
                                    accept="image/*"
                                    id="img-upload"
                                    onChange={this.onSelectingImage}
                                ></input>

                                <label htmlFor="img-upload">
                                    <FontAwesomeIcon icon={faImage} />
                                </label>
                            </div>


                            <div class="reply-tweet-submit-container" style={styles.tweetButton}>
                                <Button class="btn-container" type="submit">
                                    Tweet
                                </Button>
                            </div>
                        </Form.Row>
                    </div>
                </Form>
            </div>
        );
    }
}

const styles = {
    profileImage: {
        // flex: 1,
        display: "flex",
        flexDirection: "column",
        paddingRight: 15
    },
    tweetTextBox: {
        flex: 5,
        display: "flex",
        marginTop: 20,
        flexDirection: "column",
        "padding-right": 15
    },
    image: {
        display: "flex",
        flexDirection: "column",
        paddingRight: 10
    },
    tweetButton: {
        display: "flex",
        flexDirection: "column",
        width: "5",
        "margin-right": 15,
        marginLeft: "auto"
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTweet);

