import React, { Component } from "react";
import { Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tweet from "../Tweet/CreateTweet";

import {
    faBell,
    faBookmark,
    faEllipsisH,
    faEnvelope,
    faHashtag,
    faHome,
    faImage,
    faListAlt,
    faUserCircle,
    faLongArrowAltLeft
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import "./sidebar.css";
import {createTweet} from "../../redux/actions/tweetsActions";
import {connect} from "react-redux";
import axios from "axios";
import {Redirect} from "react-router";
import {HOSTNAME} from "../../constants/appConstants";

function mapStateToProps(store) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        createTweet: (payload) => dispatch(createTweet(payload))
    };
}

// import "../../images/home.png";
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openTweetModal: false,
            anchorEl: null,
            setAnchorEl: null,
            selectedTweetImage: null,
            redirectToAnalytics: false,
            toLogout: false
        };

        this.newTweet = this.newTweet.bind(this);
        this.cancelTweet = this.cancelTweet.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        // const [anchorEl, setAnchorEl] = React.useState(null);
    }

    onFileChange(files) {
        console.log("onFileChange event triggered");
        // if (files == null || files.length == 0) return;
        // let file = files[0];
        // const data = new FormData();
        // data.append("image", file, file.name);
        // var headers = {
        //   "Content-Type": "application/json",
        //   Authorization: "Bearer " + sessionStorage.getItem("token")
        // };
        // axios
        //   .post(`http://` + connectionUrl + `/image/${email_id}/imgupload`, data, {
        //     headers: headers
        //   })
        //   .then(res => {
        //     if (res.status === 200) {
        //       this.setState({ profile_image: res.data.imageUrl.imageUrl });
        //       console.log("success", this.state.profile_image);
        //     }
        //   })
        //   .catch(err => console.error(err));
        console.log("image uploading code. ");
    }

    newTweet = e => {
        this.setState({ openTweetModal: true });
    };

    cancelTweet = e => {
        this.setState({ openTweetModal: false });
    };

    sendData = (screenName) => {
        console.log("In sendData");
        console.log("screenName: " + screenName);
        this.props.parentCallback(screenName);
    };
    handleClick = event => {
        console.log("value: ", event.currentTarget);
        this.setState({ anchorEl: event.currentTarget })
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    logout = () => {
        //logout here
        console.log("logout state::::::");
        this.setState({ toLogout: true });
        localStorage.clear();
        //localStorage.setItem('userActive', 'truee');
    }

    onSelectingImage = (e) => {
        this.setState({
            selectedTweetImage: e.target.files[0]
        }, () => {
            console.log("selectedTweetImage", this.state.selectedTweetImage)
        });
    }

    createTweet = (e) => {
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
        owner["image"] = "";

        const tweet = {}
        tweet["data"] = data;
        tweet["ownerId"] = localStorage.getItem("id");
        tweet["owner"] = owner;
        tweet["retweet"] = [];
        tweet["hashTags"] = [];

        console.log("createTweet payload");
        console.log(tweet);

        const formData = new FormData();
        console.log("this.state.selectedTweetImage", this.state.selectedTweetImage)

        if (this.state.selectedTweetImage !== null) {
            console.log("XXXXXX inside if condition");
            formData.append('image', this.state.selectedTweetImage, this.state.selectedTweetImage.name);
            axios.post(`http://${HOSTNAME}:8080/api/v1/img-upload`, formData, {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
                    // 'Authorization': localStorage.getItem('token')
                }}).then((response) => {
                    tweet["data"] = {...tweet["data"], image: response.data.location};

                    console.log("testing data with image:", tweet);
                    this.props.createTweet(tweet);
                })
                //.then(() => this.cancelTweet())
        } else {
            console.log("XXXXX inside else")
            tweet["data"] = {...tweet["data"], image: null};
            this.props.createTweet(tweet);
            //this.cancelTweet();
        }
    };

    render() {
        return (
            <div class="sidebar-container row">
                {this.state.redirectToAnalytics && <Redirect to={{
                    pathname: "/analytics"
                }} />}
                {this.state.toLogout && <Redirect to={{
                    pathname: "/login"
                }} />}
                <div class="col-sm-3 sidebar">
                    <div class="list-group sidebar-list col-sm-12">
                        <div className="twitter-icon">
                            <FontAwesomeIcon icon={faTwitter} />
                        </div>

                        <button
                            type="button"
                            class="list-group-item list-group-item-action borderless sidebar-button"
                            onClick={() => this.sendData("Home")}>
                            {/* <img src={require("../../images/home.png")} height="35" /> */}
                            <FontAwesomeIcon icon={faHome} />
                            <span>Home</span>
                        </button>
                        <button
                            type="button"
                            class="list-group-item list-group-item-action borderless"
                        >
                            {/* <img src={require("../../images/explore.png")} height="35" /> */}
                            <FontAwesomeIcon icon={faHashtag} />
                            <span>Explore</span>
                        </button>
                        <button
                            type="button"
                            class="list-group-item list-group-item-action borderless"
                        >
                            <FontAwesomeIcon icon={faBell} />
                            <span>Notification</span>
                        </button>
                        <button
                            type="button"
                            className="list-group-item list-group-item-action borderless"
                            onClick={() => this.sendData("LikedTweets")}
                        >
                            <FontAwesomeIcon icon={faHeart}/>
                            <span>Liked Tweets</span>
                        </button>
                        <button
                            type="button"
                            class="list-group-item list-group-item-action borderless"
                            onClick={() => this.sendData("Messages")}
                        >
                            {/* <img src={require("../../images/message.png")} height="35" /> */}
                            <FontAwesomeIcon icon={faEnvelope} />
                            <span>Messages</span>
                        </button>
                        <button
                            type="button"
                            class="list-group-item list-group-item-action borderless"
                            onClick={() => this.sendData("Bookmarks")}
                        >
                            <FontAwesomeIcon icon={faBookmark} />
                            <span>Bookmarks</span>
                        </button>
                        <button
                            type="button"
                            class="list-group-item list-group-item-action borderless"
                            onClick={() => this.sendData("ViewDetailedTweet")}
                        >
                            <FontAwesomeIcon icon={faBookmark} />
                            <span>View Detailed Tweet</span>
                        </button>
                        <button
                            type="button"
                            class="list-group-item list-group-item-action borderless"
                            onClick={() => this.sendData("Profile")}>
                            <FontAwesomeIcon icon={faUserCircle} />
                            <span>Profile</span>
                        </button>
                        <button
                            type="button"
                            class="list-group-item list-group-item-action borderless"
                            onClick={() => this.sendData("List")}
                        >
                            <FontAwesomeIcon icon={faListAlt} />
                            <span>List</span>
                        </button>

                        <button
                            type="button"
                            className="list-group-item list-group-item-action borderless"
                            onClick={() => this.sendData("ViewDetailedList")}
                        >
                            <FontAwesomeIcon icon={faBookmark}/>
                            <span>View Detailed List</span>
                        </button>

                        <button
                            type="button"
                            className="list-group-item list-group-item-action borderless"
                            onClick={() => this.sendData("ViewUserProfile")}
                        >
                            <FontAwesomeIcon icon={faBookmark}/>
                            <span>View User Profile</span>
                        </button>

                        <button class="list-group-item list-group-item-action borderless" aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}  >
                            <FontAwesomeIcon icon={faEllipsisH} />
                            <span>More</span>
                        </button>
                        <Menu
                            id="simple-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={() => this.setState({redirectToAnalytics: true})}>Analytics</MenuItem>
                            <MenuItem onClick={() => {
                                this.sendData("Settings");
                                this.handleClose();
                            }}>Settings and privacy</MenuItem>
                            <MenuItem onClick={() => this.logout()}>Logout</MenuItem>
                        </Menu>
                        {/* <button
                            type="button"
                            class="list-group-item list-group-item-action borderless"
                        >
                            <FontAwesomeIcon icon={faEllipsisH} />
                            <span>More</span>
                        </button> */}
                        <button
                            type="button"
                            onClick={this.newTweet}
                            class="btn btn-primary submit-btn"
                        >
                            <span>Tweet</span>
                        </button>
                    </div>
                </div>
                {/* <div class="col-sm-9"></div> */}
                <Modal
                    show={this.state.openTweetModal}
                    onHide={this.cancelTweet}
                    animation={false}
                >
                    <Tweet/>
                    {/*<Modal.Header closeButton></Modal.Header>*/}

                    {/*<Modal.Body>*/}
                    {/*    <Form onSubmit={this.createTweet}>*/}
                    {/*        <div class="tweet-container row">*/}
                    {/*            <div class="col-sm-1">*/}
                    {/*                <img*/}
                    {/*                    //../../static/images/profile_pic.png*/}
                    {/*                    src={require("../../static/images/profile_pic.png")}*/}
                    {/*                    height="35"*/}
                    {/*                    width="35"*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*            <div class="text-area-container col-sm-11">*/}
                    {/*                <textarea*/}
                    {/*                    class="form-control text-area"*/}
                    {/*                    id="text"*/}
                    {/*                    placeholder="What's happening"*/}
                    {/*                    rows="4"*/}
                    {/*                ></textarea>*/}
                    {/*                /!* <Form.Group controlId="formGridcreateTweet">*/}
                    {/*                    <Form.Control as="textarea" rows="3" placeholder="What's happening?" />*/}
                    {/*                </Form.Group> *!/*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div class="tweet-footer" >*/}
                    {/*            <div className="image-icon">*/}
                    {/*                <input*/}
                    {/*                    class="image-btn"*/}
                    {/*                    type="file"*/}
                    {/*                    accept="image/*"*/}
                    {/*                    id="img-upload"*/}
                    {/*                    onChange={this.onSelectingImage}*/}
                    {/*                ></input>*/}

                    {/*                <label for="img-upload">*/}
                    {/*                    <FontAwesomeIcon icon={faImage} />*/}
                    {/*                </label>*/}
                    {/*            </div>*/}
                    {/*            <div class="btn-tweet">*/}
                    {/*                <button class="btn btn-primary submit-btn"*/}
                    {/*                        type="submit"*/}
                    {/*                >*/}
                    {/*                    Tweet*/}
                    {/*                    </button>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </Form>*/}
                    {/*</Modal.Body>*/}
                    {/* <Modal.Footer>
                        <div className="image-icon">
                            <input
                                class="image-btn"
                                type="file"
                                accept="image/*"
                                id="img-upload"
                                onClick={e => this.onFileChange(e.target.files)}
                            ></input>

                            <label for="img-upload">
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                        </div>
                        <div class="btn-tweet">
                            <button class="btn btn-primary submit-btn" type="button">
                                Tweet
                            </button>
                        </div>
                    </Modal.Footer> */}
                </Modal>
            </div>
        );
    }
}

//export default Sidebar;
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
