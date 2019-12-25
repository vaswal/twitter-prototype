import '../../css/list.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { Component } from "react";
import { HOSTNAME } from "../../constants/appConstants";

let members = []
let subscribers = []
const Image = (props) => {
    return (
        <img src={props.image} alt="Logo" className="picture-list">
        </img>
    )
};

const Handle = (props) => {
    return (
        <div className="handle-list">
            {props.handle}
        </div>
    )
};

const Name = (props) => {
    return (
        <div class="name-list">
            {props.name}
        </div>
    )
};

const List = (props) => {
    if (props.tweet.description !== undefined) {
        return (
            <div class="tweet-list">
                <Title title={props.tweet} />
                {/* <Link to={{ pathname: '/cart', state: {res:res}}}>{res.name}</Link> */}
                <div class="list-description">{props.tweet.description}</div>
                <div style={{ display: 'inline-block' }}>
                    <Members members={props.tweet} />
                    <Subscribers subscribers={props.tweet} />
                </div>
            </div>
        )
    } else {
        return (
            <div className="tweet-list">
                <Title title={props} />
                <br />
                <div style={{ display: 'inline-block' }}>
                    <Members members={props.tweet} />{' '}{' '}
                    <Subscribers subscribers={props.tweet} />
                </div>
            </div>
        )
    }
};

const Title = (props) => {
    if (props !== undefined) {
        return (
            <div> <Link class="list-title" to={{
                pathname: '/listtweet',
                state: { listId: props.title.id, list: props.title }
            }}>
                {props.title.name}
            </Link></div>
        )
    }
};

const Members = (props) => {
    return (
        <div class="list-members"> {members.length} members</div>
    )
};

const Subscribers = (props) => {
    return (
        <div class="list-subscribers"> {subscribers.length} subscribers</div>
    )
};

class ListBody extends Component {
    constructor(props) {
        super(props);
        this.displayTweet = this.displayTweet.bind(this);
    }
    displayTweet(id) {
        try {
            document.querySelector("#root > div > div > div > div > div.col-lg-3 > div > div > div > button:nth-child(11)").setAttribute("data-list-props", JSON.stringify(this.props.tweet));
            document.querySelector("#root > div > div > div > div > div.col-lg-3 > div > div > div > button:nth-child(11)").click();
        }
        catch (e) {
            console.log(e);
        }
    }

    componentDidMount() {
        var headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        };
        axios.get(`http://${HOSTNAME}:8080/api/v1/list/${this.props.tweet.id}/members`, { headers: headers })
            .then(response => {
                members = response.data.data.members
            })
            .catch(err => {
                console.error(err);
            });

        axios.get(`http://${HOSTNAME}:8080/api/v1/list/${this.props.tweet.id}/subscribers`, { headers: headers })
            .then(response => {
                subscribers = response.data.data.subscribers
            })
            .catch(err => {
                console.error(err);
            });


    }
    render() {
        //console.log("check list ----------------", this.props);
        return (
            <div class="list-group">
                <button type="button" className="inner-body list-group-item list-group-item-action" onClick={(e) => this.displayTweet(this.props)}>
                    {
                        this.props.image ? (<Image image={this.props.image} />) : (<Image image="https://thefader-res.cloudinary.com/private_images/w_760,c_limit,f_auto,q_auto:best/TwitterLogo__55acee_jntmic/twitter-applications-verified.jpg" />)
                    }
                    {/* <div className="inner-body-list list-group-item list-group-item-action">
                        <Image image={props.image} /> */}
                    <div className="body">
                        <div className="inner-body-inner-list">
                            <Name name={this.props.name} />
                            <Handle handle={this.props.handle} />
                        </div>
                        <List tweet={this.props.tweet} />
                    </div>
                    {/* </div > */}
                </button>
            </div>
        )
    }
}

export default ListBody;