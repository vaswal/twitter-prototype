import React, { Component } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import "./profile.css";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import ViewTweets from "../Tweet/ViewTweets";
import { getProfile, getfollowees, getfollowers } from "../../redux/actions/userActions";
import { getTweetsById } from "../../redux/actions/tweetsActions";
import axios from 'axios';
import { Link } from "react-router-dom";
import UserList from '../Search/User/UserList';
import InfiniteScroll from 'react-infinite-scroller';
import FollowList from "./userlist";
import { HOSTNAME } from "../../constants/appConstants";

function mapStateToProps(store) {
    return {
        userDetails: store.users.userDetails,
        userTweets: store.tweets.userTweets,
        userFollowers: store.users.follower,
        userFollowee: store.users.followee
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getProfileDetails: data => dispatch(getProfile(data)),
        getUserTweets: data => dispatch(getTweetsById(data)),
        getUserfollowers: data => dispatch(getfollowers(data)),
        getUserfollowees: data => dispatch(getfollowees(data))
    }
}

class userprofile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editProfile: false, //for modal
            selectedCoverPic: null,
            selectedProfilePic: null,
            openFollower: false,
            users: [],
            openFollowee: false,
            followUnfollowDate: null
        };
    }
    componentWillMount = () => {
        const data = {
            user_id: this.props.userProps.id
        };

        this.props.getProfileDetails(data);
        this.props.getUserTweets(data);
        this.props.getUserfollowees(data);// ISSUE WITH API SO COMMENTING
        this.props.getUserfollowers(data);// ISSUE WITH API SO COMMENTING
        // this.getUser();
    }

    followerList = () => {
        this.setState({ openFollower: true });
    }
    closefollowerList = () => {
        this.setState({ openFollower: false });
    }
    followeeList = () => {
        this.setState({ openFollowee: true });
    }
    closefolloweeList = () => {
        this.setState({ openFollowee: false });
    }
    componentDidMount() {
    }
    getDate = () => {
        if (this.props.userDetails) {
            if (this.props.userDetails.createdAt) {
                let date = this.props.userDetails.createdAt;
                console.log("kkkk:", date);
                let newDate = new Date(date);
                let day = newDate.getDay() + 1
                var month = new Array();
                month[0] = "Jan";
                month[1] = "Feb";
                month[2] = "Mar";
                month[3] = "Apr";
                month[4] = "May";
                month[5] = "Jun";
                month[6] = "Jul";
                month[7] = "Aug";
                month[8] = "Sep";
                month[9] = "Oct";
                month[10] = "Nov";
                month[11] = "Dec";
                var mon = month[newDate.getMonth()];
                let joinedDate = day + "-" + mon + "-" + newDate.getFullYear();
                console.log(" date :", joinedDate);
                return joinedDate;
            } else {
                return ""
            }

        } else {
            return " "
        }
    }
    unFollowUser = () => {
        let followData = {
            "followeeId": this.props.userProps.id
        }
        var headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        };
        axios.put(`http://${HOSTNAME}:8080/api/v1/user/` + localStorage.getItem('id') + '/unfollow', followData, { headers: headers })
            .then(res => {
                console.log("test result :", res);
                if (res.data.status === "ok") {
                    alert("Profile unfollowed successfully");
                    this.setState({ date: new Date().getTime() })
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    followUser = () => {
        let followData = {
            "followeeId": this.props.userProps.id
        }
        var headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        };
        axios.put(`http://${HOSTNAME}:8080/api/v1/user/` + localStorage.getItem('id') + '/follow', followData, { headers: headers })
            .then(res => {
                console.log("test result :", res);
                if (res.data.status === "ok") {
                    alert("Profile followed successfully");
                    this.setState({ date: new Date().getTime() })
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    followUnfollowBtn = () => {
        if (this.props.userDetails) {
            if (this.props.userProps.followed) {
                return (<button
                    type="button"
                    // style="display: none"
                    onClick={this.unFollowUser}
                    class="btn btn-primary edit-profile-btn"
                >
                    Unfollow
                </button>)
            }
            else {
                return (<button
                    type="button"
                    // style="display: none"
                    onClick={this.followUser}
                    class="btn btn-primary edit-profile-btn"
                >
                    Follow
                </button>)
            }
        } else {
            return (<button
                type="button"
                // style="display: none"
                onClick={this.followUser}
                class="btn btn-primary edit-profile-btn"
            >
                Follow
            </button>);
        }
    }
    render() {
        console.log("checking props for user profile: ", JSON.stringify(this.props));
        let usrDetails = this.props.userDetails ? this.props.userDetails : [];
        let usrTweets = this.props.userTweets ? this.props.userTweets : [];
        let tweetCount = usrTweets.length ? usrTweets.length : 0;
        let usrFollower = this.props.userFollowers ? this.props.userFollowers : [];
        let usrFollowee = this.props.userFollowee ? this.props.userFollowee : [];
        let userData = usrDetails.data ? usrDetails.data : [];
        // console.log("usrFollowee length :", Object.keys(usrFollowee).length);
        if (this.state.openFollower) {
            return (<FollowList openFollower={this.state.openFollower} title={"Follower List"} closeList={this.closefollowerList}
                users={usrFollower.followers}
                profile={usrDetails}
                getUsers={usrDetails}
                hasMore={false}
            ></FollowList>)
        }
        else if (this.state.openFollowee) {
            return (<FollowList openFollowee={this.state.openFollowee} title={"Followee List"} closeList={this.closefolloweeList}
                users={usrFollowee.followees}
                profile={usrDetails}
                getUsers={usrDetails}
                hasMore={false}
            ></FollowList>)
        }

        return (
            <div class="profile-container col-sm-12">
                <div class="top-details row">
                    <div class="offset-sm-1">
                        <div class="profile-name-header">{usrDetails.firstName ? usrDetails.firstName : "" + " " + usrDetails.lastName ? usrDetails.lastName : ""}</div>
                        <div class="profile-tweets-header">{tweetCount} tweets</div>
                    </div>
                </div>
                <div class="profile-cover-pic row">
                    <img
                        src={userData.coverPic ? userData.coverPic : require("../../static/images/cover_pic1.png")}
                        width="100%"
                        height="200px"
                    />
                </div>
                <div class="profile-pic-btn-container row">
                    <div class="profile-profile-pic col-sm-6">
                        <img src={userData.profileImage ? userData.profileImage : require("../../static/images/profile_pic.png")} height="120" width="120px" />
                    </div>
                    <div class="col-sm-6 edit-btn">
                        {this.followUnfollowBtn()}
                    </div>
                </div>
                <div class="profile-details row">
                    <div class="col-sm-12">
                        <div class="profile-name-header ">{usrDetails.firstName ? usrDetails.firstName : ""} {usrDetails.lastName ? usrDetails.lastName : ""}</div>
                        <div class="profile-detail-font">@{usrDetails.username ? usrDetails.username : ""}</div>
                        <div class="profile-dates row">
                            {/* <div class="col-sm-4 profile-detail-font">
                                <FontAwesomeIcon icon={faBirthdayCake} />
                                <span> born {}</span>
                            </div> */}
                            <div class="col-sm-8 profile-detail-font">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span> Joined {this.getDate()}</span>
                            </div>
                        </div>
                        <div class="followers-following row">
                            <div class="col-sm-3 profile-detail-font"><Link class="link-color" onClick={this.followerList}>{usrFollower.count ? usrFollower.count : 0} Followers</Link></div>
                            <div class="offset-sm-1 col-sm-3 profile-detail-font"><Link class="link-color" onClick={this.followeeList}>{usrFollowee.count ? usrFollowee.count : 0} Following</Link></div>
                        </div>
                        <div class="followers-following row">
                            <div class="col-sm-10 profile-detail-font">{userData.state ? userData.state : ""} {userData.city ? userData.city : ""} {userData.zipcode ? userData.zipcode : ""}</div>
                        </div>
                    </div>
                </div>
                <div class="heading row"><div class="tweets-heading col-sm-4">Tweets</div></div>
                <div class="tweets-list" row>
                    <ViewTweets dataFromParent={usrTweets} />
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(userprofile);
