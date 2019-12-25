import React, { Component } from "react";
import { Form, Modal } from "react-bootstrap";
import "./profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBirthdayCake, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import ViewTweets from "../Tweet/ViewTweets";
////////////////////// REDUX CODE //////////////////////
// function mapStateToProps(store) {
//   return {
//     profile_image: store.login.profile_image
//   };
// }
// function mapDispatchToProps(dispatch) {
//   return {
//     getResProfile: data => dispatch(getResProfile(data))
// }

class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editProfile: false, //for modal
            testName: "Akshit Ahuja",
            users: []
        };
        this.onCoverPicUpload = this.onCoverPicUpload.bind(this);
        this.onProfilePicUpload = this.onProfilePicUpload.bind(this);
    }
    componentWillMount = () => {
        this.getUser()
    }

    getUser = () => {
        fetch('https://randomuser.me/api/')
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Request failed.');
            })
            .then(data => {
                this.setState({
                    users: [
                        {
                            name: data.results[0].name,
                            image: data.results[0].picture.medium,
                            tweet: data.results[0].email,
                        },
                        ...this.state.users,
                    ]
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    editProfile = () => {
        this.setState({ editProfile: true });
    };

    componentDidMount() {
        ///////////// USER CODE TO GO HERE ////////////////////
        // const email = localStorage.getItem("email_id");
        // const data = {
        // email_id: email
        // };
        // console.log("data    " + JSON.stringify(data));
        // this.props.getProfile(data);
    }

    cancelEdit = () => {
        this.setState({ editProfile: false });
    };
    saveProfile = () => {
        // save profile code
        this.setState({ editProfile: false });
    };

    onCoverPicUpload(files) {
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

    onProfilePicUpload(files) {
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

    render() {
        return (
            <div class="profile-container col-sm-12">
                <div class="top-details row">
                    <div class="offset-sm-1">
                        <div class="profile-name-header">Akshit</div>
                        <div class="profile-tweets-header">0 tweets</div>
                    </div>
                </div>
                <div class="profile-cover-pic row">
                    <img
                        src={require("../../static/images/cover_pic1.png")}
                        width="100%"
                        height="200px"
                    />
                </div>
                <div class="profile-pic-btn-container row">
                    <div class="profile-profile-pic col-sm-6">
                        <img src={require("../../static/images/profile_pic.png")} height="120" />
                    </div>
                    <div class="col-sm-6 edit-btn">
                        <button
                            type="button"
                            onClick={this.editProfile}
                            class="btn btn-primary edit-profile-btn"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
                <div class="profile-details row">
                    <div class="col-sm-12">
                        <div class="profile-name-header ">Akshit Ahuja</div>
                        <div class="profile-detail-font">@{"AkshitAhuja19"}</div>
                        <div class="profile-dates row">
                            <div class="col-sm-3 profile-detail-font">
                                <FontAwesomeIcon icon={faBirthdayCake} />
                                <span> born Jan 10, 1992</span>
                            </div>
                            <div class="col-sm-3 profile-detail-font">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span> Joined Oct 2019</span>
                            </div>
                        </div>
                        <div class="followers-following row">
                            <div class="col-sm-2 profile-detail-font">{"2"} Following</div>
                            <div class="col-sm-2 profile-detail-font">{"2"} Following</div>
                        </div>
                    </div>
                </div>
                <div class="heading row"><div class="tweets-heading col-sm-2">Tweets</div></div>
                <div class="tweets-list" row>
                    <ViewTweets dataFromParent={this.state.users} />
                </div>

                <Modal
                    show={this.state.editProfile}
                    onHide={this.cancelEdit}
                    animation={false}
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <div class="btn-tweet">
                            <button
                                class="btn btn-primary save-btn"
                                type="button"
                                onClick={this.saveProfile}
                            >
                                Save
                            </button>
                        </div>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div class="edit-profile-continer">
                            <div class="cover-pic-container row">
                                <input
                                    class="profile-pic-btn"
                                    type="file"
                                    accept="image/*"
                                    id="proile-pic-upload"
                                    onClick={e => this.onCoverPicUpload(e.target.files)}
                                ></input>

                                <label for="proile-pic-upload">
                                    <img
                                        src={require("../../static/images/cover_pic1.png")}
                                        width="100%"
                                        height="180px"
                                    />
                                </label>
                            </div>
                            <div class="profile-pic-container row">
                                <input
                                    class="profile-pic-btn"
                                    type="file"
                                    accept="image/*"
                                    id="proile-pic-upload"
                                    onClick={e => this.onProfilePicUpload(e.target.files)}
                                ></input>

                                <label for="proile-pic-upload">
                                    <img
                                        src={require("../../static/images/profile_pic.png")}
                                        height="80px"
                                    />
                                </label>
                            </div>
                        </div>
                        <div class="edit-details-form">
                            <Form>
                                <Form.Group controlId="formGridName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        placeholder="Add your Name"
                                        value={this.state.testName}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGridBio">
                                    <Form.Label>Bio</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows="3"
                                        placeholder="Add your Bio"
                                        value=""
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGridLocation">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control placeholder="Add Your Location" value="" />
                                </Form.Group>
                                <Form.Group controlId="formGridWebsite">
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control placeholder="Add your Website" value="" />
                                </Form.Group>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default profile;
/////////////////////// CALL FOR REDUX ACTION ///////////////////
// export default connect(mapStateToProps,mapDispatchToProps)(profile);
