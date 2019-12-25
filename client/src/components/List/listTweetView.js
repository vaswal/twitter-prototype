import React, { Component } from "react";
import "../Profile/profile.css";
import '../../css/list.css'
import ViewTweets from "../Tweet/ViewTweets";
import { connect } from "react-redux";
import { getListById, getTweetByList } from "../../redux/actions/listActions";
import axios from 'axios';
import listImg from '../../images/EEDaJw0U4AADASA.jpeg';
import { HOSTNAME } from "../../constants/appConstants";

function mapStateToProps(store) {
  return {
    currentList: store.list.currentList,
    feed: store.list.feed,
    ownedlists: store.list.ownedlists,
    subscribedList: store.list.subscribedList,
    membersList: store.list.membersList,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getListById: (id) => dispatch(getListById(id)),
    getTweetByList: (id) => dispatch(getTweetByList(id))
  };
}

class ListTweetView extends Component {
  constructor(props) {
    super(props);
    console.log("listtweetview", this.props.listDetailedProps.data.userId);

    this.state = {
      listId: this.props.listDetailedProps.id,
      userId: this.props.listDetailedProps.data.userId,
      list: "",
      listName: "",
      userName: "",
      name: "",
      users: [],
      members: [],
      subscribers: [],
      isSubscribed: this.props.listDetailedProps.subscribed,
      showSubscribe: (this.props.listDetailedProps.subscribed) ? false : true,
      showEdit: (this.props.listDetailedProps.data.userId == localStorage.getItem("id")) ? true : false,
      buttonText: this.props.listDetailedProps.subscribed ? "Unsubscribed" : "Subscribed",
      class: this.props.listDetailedProps.subscribed ? "btn btn-outline-primary" : "btn btn-primary"
    };

    console.log("--------", this.props.listDetailedProps.subscribed);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount = () => {
    this.getUser()
  }

  getUser = () => {
    // this.props.getListById(this.state.listId);
    var headers = {

      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    };
    if (this.state.listId != undefined) {
      axios.get(`http://${HOSTNAME}:8080/api/v1/list/get/${this.state.listId}`, { headers: headers })
        .then(response => {
          console.log("getlistbyid", response)
          this.setState(
            {
              listName: response.data.data.list.name,
              userName: "@" + response.data.data.list.data.username,
              name: response.data.data.list.data.firstName + " " + response.data.data.list.data.lastName,
              isSubscribed: response.data.data.list.subscribed,
              memCount: response.data.data.list.membersCount,
              subCount: response.data.data.list.subscribersCount,
              list: response.data.data.list
            }
          );
        })
        .catch(err => {
          console.error(err);
        });

      // this.props.getTweetByList(this.state.listId);
      axios.get(`http://${HOSTNAME}:8080/api/v1/feed/list/${this.state.listId}`, { headers: headers })
        .then(response => {
          console.log("getTeetBYlist", response)
          this.setState(
            {
              users: response.data.data.tweets
            }, () => console.log('message response', this.state.users)
          );
        })
        .catch(err => {
          console.error(err);
        });

      axios.get(`http://${HOSTNAME}:8080/api/v1/list/${this.state.listId}/members`, { headers: headers })
        .then(response => {

          console.log("members count", response.data.data.members);
          this.setState(
            {
              members: response.data.data.members
            });

        })
        .catch(err => {
          console.error(err);
        });

      axios.get(`http://${HOSTNAME}:8080/api/v1/list/${this.state.listId}/subscribers`, { headers: headers })
        .then(response => {
          console.log(" subscribers  count", response.data.data.subscribers);
          this.setState(
            {
              subscribers: response.data.data.subscribers
            });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  componentDidMount() {
    this.getUser();
  }

  handleClick() {
    console.log("handleclick");
    const payload = {
      "subscriberId": this.state.userId
    };
    var headers = {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    };
    if (this.state.buttonText == "Subscribed") {
      console.log("not subscribed");

      axios.put(`http://${HOSTNAME}:8080/api/v1/list/${this.state.listId}/unsubscribe`, payload, { headers: headers })
        .then(response => {
          console.log(response)
          this.setState({
            buttonText: "UnSbscribed",
            class: "btn btn-danger"
          })
        })
        .catch(err => {
          console.error(err);
        });

    } else {
      console.log("subscribed");
      axios.put(`http://${HOSTNAME}:8080/api/v1/list/${this.state.listId}/subscribe`, payload, { headers: headers })
        .then(response => {
          console.log(response)
          this.setState({
            buttonText: "Subscribed",
            class: "btn btn-outline-primary"
          })
        })
        .catch(err => {
          console.error(err);
        });

    }

  }

  render() {
    return (
      <div class="profile-container col-sm-12">
        <div class="top-details row">
          <div class="offset-sm-1">
            <div class="profile-name-header">{this.state.listName}</div>
            <div class="profile-tweets-header">{this.state.userName}</div>
          </div>
        </div>
        <div class="profile-cover-pic row">
          <img
            src={listImg}
            width="100%"
            height="200px"
          />
        </div>
        <div class="profile-details row">
          <div class="col-sm-9">
            <div class="profile-name-header ">{this.state.listName}</div>
            <div class="followers-following row">
              <div class="col-sm-1 profile-detail-font">{this.state.name}</div>
              <div class="offset-sm-2 col-sm-3 profile-detail-font">{this.state.userName}</div>
            </div>
            <div class="followers-following row">
              <div class="col-sm-4 profile-detail-font">{this.state.memCount} Members</div>
              <div class="col-sm-4 profile-detail-font">{this.state.subCount} Subscribers</div>
            </div>
          </div>
        </div>
        {this.state.showSubscribe && <button type="button" class={this.state.class} onClick={() => this.handleClick()}>{this.state.buttonText}</button>}
        <div class="heading row"><div class="tweets-heading col-sm-2">Tweets</div></div>
        <div class="tweets-list" row>
          <ViewTweets dataFromParent={this.state.users} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTweetView);
