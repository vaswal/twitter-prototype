import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Button, Row, Col } from 'reactstrap';


import { UserBody } from './UserBody';
import { HOSTNAME } from "../../../constants/appConstants";
const API_PATH = `http://${HOSTNAME}:8080/api/v1`

class UserComponent extends Component {
    state = {
        followed: this.props.user.followed,
    }

    tokenConfig = () => {
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        if (token) {
            config.headers['Authorization'] = token;
        }

        return config;
    };

    follow = (followeeId) => {
        axios.put(API_PATH + `/user/${this.props.callerId}/follow`, { followeeId:this.props.user.id }, this.tokenConfig()).then(res => {
            if (res.data.status ) {
                this.setState({
                    followed: true
                });
            }
        }).catch(err => {
            console.log(err);
        });

    }

    unfollow = (followeeId) => {
        axios.put(API_PATH + `/user/${this.props.callerId}/unfollow`, { followeeId:this.props.user.id }, this.tokenConfig()).then(res => {
            if (res.data.status ) {
                this.setState({
                    followed: false
                });
            }
        }).catch(err => {
            console.log(err);
        });

    }

    render() {
        return (<Row>
                        <Col className="col-10">
            <div className="inner-body list-group-item-action">
                <UserBody
                    user={this.props.user}
                /></div>
            </Col>
            <Col className="text-right">
                {this.props.callerId ? (this.state.followed ? (<div class="reply-tweet-submit-container" >
                    <Button class="btn-container" color='danger' type="block submit" onClick={this.unfollow.bind(this)}>
                        Unfollow
        </Button>
                </div>) : (<div class="reply-tweet-submit-container" >
                    <Button class="btn-container"  color='primary' type="block submit" onClick={this.follow.bind(this)}>
                        Follow
        </Button>
                </div>)) : <div></div>}
            </Col>
        </Row>)
    }
}

export default UserComponent;