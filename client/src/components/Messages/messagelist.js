import React, { Component } from 'react';
import { Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faComment } from "@fortawesome/free-solid-svg-icons";
import Chat from '../Chat/chat';
import "./messagelist.css";
import axios from 'axios';

class messagelist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startNewChat: false,
            users: [],
            chatList: [],
            receiverID: null,
            username: "",
            showChat: false,
            channel: null,
            selectedUserForChat: null,
            showPreviousChat: false,
            defaultImg: "https://thefader-res.cloudinary.com/private_images/w_760,c_limit,f_auto,q_auto:best/TwitterLogo__55acee_jntmic/twitter-applications-verified.jpg"
        }
    }
    newChat = () => {
        //////opening modal for search people//////////
        this.setState({ startNewChat: true });
    }
    closeNewChat = () => {

        //////closing modal for search people//////////
        this.setState({ startNewChat: false, users: [] });
    }
    handleChange = (e) => {
        //search user api in below function
        this.setState({ username: e.target.value });
    }

    componentDidMount = () => {
        //////////////////get the list of previous chat list of the users/////////////////
        axios.defaults.withCredential = true;
        let userId = localStorage.getItem('id');
        axios.get(`http://13.52.36.139:8080/api/v1/conversation/getByUser/${userId}`)
            .then(response => {
                this.setState(
                    {
                        chatList: response.data.data
                    }
                );
            })
            .catch(err => {
                console.error(err);
            });
    }

    searchUsers = (e) => {
        e.preventDefault();
        var params = new URLSearchParams();
        params.append("text", this.state.username);
        let request = {
            params: params
        };
        axios.defaults.withCredential = true;
        //let userId = localStorage.getItem('userId');
        let userId = 1;
        axios.get(`http://13.52.36.139:8080/api/v1/search/users`, request)
            .then(response => {
                console.log("check here ->>>>>>>>>>>>", response.data.data.users);
                this.setState(
                    {
                        users: response.data.data.users
                    }
                );
            })
            .catch(err => {
                console.error(err);
            });
    }



    setClick = (receiverId, index) => {
        if (this.state.users[index]) {
            let _this = this;
            this.setState({ showChat: true, receiverId: receiverId }, () => {
                try {
                    if (!document.querySelector(".sc-chat-window").classList.contains("opened")) {
                        document.querySelector("#sc-launcher > div.sc-launcher").click();
                    }
                    document.querySelector(".sc-header--team-name").innerHTML = this.state.users[index]["username"];
                    _this.setState({
                        startNewChat: false, users: [], username: ""
                    })
                }
                catch (e) {
                    console.log(e);
                }
            });
        }

    }

    openChat = () => {
        if (this.state.showChat) {
            let senderId = Number(localStorage.getItem('id'));
            let receiverId = Number(this.state.receiverId);
            let channel = "" //senderId + "|" + receiverId;
            channel = Math.max(senderId, receiverId) + "|" + Math.min(senderId, receiverId);
            channel = channel.toString();
            //let channel2 = receiverId + "|" + senderId;

            return (<div>
                <Chat channel={channel} />

            </div>);
        }
    }

    closeModal = () => {
        this.setState({ startNewChat: false, users: [], username: "" });
    }

    setpreviousChat = (chat, participantName) => {
        this.setState({ showPreviousChat: true, channel: chat.channel }, () => {
            try {
                if (!document.querySelector(".sc-chat-window").classList.contains("opened")) {
                    document.querySelector("#sc-launcher > div.sc-launcher").click();
                }
                document.querySelector(".sc-header--team-name").innerHTML = participantName;
            }
            catch (e) {
                console.log(e);
            }
        });
    }

    previousChat = () => {
        console.log(this.state);
        if (this.state.showPreviousChat) {
            return (<React.Fragment>
                <Chat channel={this.state.channel} />
            </React.Fragment>)
        }
    }

    findParticipant = (data = []) => {

        try {
            let firstName = localStorage.getItem("firstName");
            let participantName = "";
            data.forEach((message) => {
                if (message.sender && message.sender != firstName) {
                    participantName = message.sender;
                }
            });
            if (data.length == 1) {
                participantName = data[0].sender;
            }
            return participantName;
        }
        catch (e) {
            console.log(e);
            return "";
        }

    }

    render() {
        let userList = null, noMsgContainer = null, messageList = null;
        if (this.state.users.length > 0) {
            console.log("here");
            userList = this.state.users.map((user, index) => {
                console.log(JSON.stringify(user));
                return (
                    <div class="list-group">
                        <div class="list-group-item list-group-item-action user-list row" id={"chatBox-" + user.id} onClick={() => this.setClick(user.id, index)}>
                            <div class="image-container col-sm-2"><img width="50px" src={user.data ? (user.data.profileImg ? user.data.profileImg : this.state.defaultImg) : this.state.defaultImg} class="profile-image" alt="avatar"></img></div>
                            <div class="col-sm-10">
                                <div class="profile-name">{user.firstName + " " + user.lastName}</div>
                                <div class="profile-email">{user.username}</div>
                                <div>chat - link</div>

                            </div>
                        </div>
                    </div>
                );
            });
        }
        if (this.state.chatList.length == 0) {
            noMsgContainer = (
                <div class="messagelist-body">
                    <div class="no-message-header">Send a message, get a message</div>
                    <div class="no-message-body">Direct Messages are private conversations between you and other people on Twitter. Share Tweets, media, and more!</div>
                    <div class="start-btn">
                        <button
                            type="button"
                            onClick={this.newChat}
                            class="btn btn-primary start-chat-btn"
                        >
                            <span>Start a conversation</span>
                        </button>
                    </div>
                </div>
            );
        }
        else {
            messageList = this.state.chatList.map(chat => {

                //Get Last Seen Date            
                let lastSeen = '';
                let lastdate = new Date(chat.updatedAt);
                let currentDate = new Date();
                const daysDiff = Math.ceil((currentDate - lastdate) / (1000 * 60 * 60));
                if (daysDiff <= 24)
                    lastSeen = daysDiff + " hr";
                else
                    lastSeen = (daysDiff % 24) + " days"


                //Get Last Message 
                let lastMessage = "";
                if (chat.messages && chat.messages.length > 0) {
                    lastMessage = chat.messages[chat.messages.length - 1]["message"];
                }

                //Get Incoming message details
                let participantName = "User";
                participantName = this.findParticipant(chat.messages);
                return (
                    <div class="list-group" onClick={() => this.setpreviousChat(chat, participantName)}>
                        <div class="list-group-item list-group-item-action chat-list-container row chat-vs">

                            <div className="user-chat-container">
                                <div className="user-details">
                                    <div className="user-name">
                                        {
                                            participantName
                                        }
                                    </div>
                                    <div className="last-message">
                                        {
                                            lastMessage
                                        }
                                    </div>
                                </div>
                                <div className="last-date">
                                    {lastSeen}
                                </div>


                            </div>

                        </div>
                    </div>);
            });
        }

        return (
            <React.Fragment>
                {this.openChat()}
                {this.previousChat()}
                < div class="message-list-container col-sm-10" >

                    <div class="message-header row">
                        <div class="col-sm-11">Messages</div>
                        <div class="col-sm-1" onClick={this.newChat}><FontAwesomeIcon icon={faComment} /></div>
                    </div>
                    <hr></hr>
                    <div>{noMsgContainer}</div>
                    <div>{messageList}</div>
                    <Modal
                        show={this.state.startNewChat}
                        onHide={this.closeNewChat}
                        animation={false}
                        scrollable={true}
                    >
                        <Modal.Header closeButton={this.closeModal}>
                            <Modal.Title>New Message</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form class="search-body" onSubmit={this.searchUsers}>
                                <Form.Group controlId="formBasicEmail">
                                    {/* <FontAwesomeIcon icon={faSearch} /> */}
                                    <Form.Control type="text" placeholder="Search people" value={this.state.username} onChange={this.handleChange}>
                                        {/* <FontAwesomeIcon icon={faSearch} /> */}
                                    </Form.Control>
                                    <div class="search-result">{userList}</div>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div >
            </React.Fragment>
        );
    }
}

export default messagelist;