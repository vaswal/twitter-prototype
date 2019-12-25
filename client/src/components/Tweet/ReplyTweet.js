import React, { Component } from 'react';
import { Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { replyTweet } from "../../redux/actions/tweetsActions";
import "./tweets.css"

function mapStateToProps(store) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        replyTweet: (payload) => dispatch(replyTweet(payload))
    };
}

class ReplyTweet extends Component {
    image = () => {
        return (
            <img src={require("../../static/images/profile_pic.png")} alt="Logo" className="profile-pic" />
        )
    };

    replyTweet = (e) => {
        e.preventDefault();

        const data = {};
        for (let i = 0; i < e.target.length; i++) {
            if (e.target[i].id !== "") {
                data[e.target[i].id] = e.target[i].value;
            }
        }

        const owner = {};
        owner["firstName"] = localStorage.getItem("firstName");
        owner["lastName"] = localStorage.getItem("lastName");
        owner["username"] = localStorage.getItem("username");
        owner["image"] = localStorage.getItem("image");

        const payload = {}
        payload.data = data;
        payload.tweetId = this.props.data;
        payload.ownerId = localStorage.getItem("id");
        payload.owner = owner;

        console.log("replyTweet payload");
        console.log(payload);

        this.props.replyTweet(payload);
        this.props.triggerReplyCountIncrement();
        this.props.closeCommentModal();
    };

    onFileChange(files) {
        console.log("onFileChange event triggered");
    }

    render() {
        console.log("replyTweet this.props.data", this.props.data)

        return (
            <div style={{ padding: 10 }}>
                <Form onSubmit={this.replyTweet}>
                    <div>
                        <Form.Row>
                            <div style={styles.profileImage}> {this.image()}</div>

                            <div style={styles.tweetTextBox}>
                                <textarea
                                    class="form-control text-area"
                                    id="text"
                                    placeholder="Tweet your reply"
                                    rows="3"
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
                                    onClick={e => this.onFileChange(e.target.files)}
                                ></input>

                                <label htmlFor="img-upload">
                                    <FontAwesomeIcon icon={faImage}/>
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

//export default ReplyTweet;
export default connect(mapStateToProps, mapDispatchToProps)(ReplyTweet);

