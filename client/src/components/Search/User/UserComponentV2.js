import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Button, Row, Col } from 'reactstrap';


import { UserBody } from './UserBody';
import { HOSTNAME } from "../../../constants/appConstants";
const API_PATH = `http://${HOSTNAME}:8080/api/v1`

class UserComponent extends Component {
    state = {
        followed: false,
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
        axios.put(API_PATH + `/list/${this.props.list.id}/add-member`, { memberId: this.props.user.id }, this.tokenConfig()).then(res => {

            this.setState({
                followed: true
            });

        }).catch(err => {
            this.setState({
                followed: true
            });
            console.log(err);
        });

    }

    unfollow = (followeeId) => {
        axios.put(API_PATH + `/user/${this.props.list.id}/remove-member`, { memberId: this.props.user.id }, this.tokenConfig()).then(res => {

            this.setState({
                followed: false
            });

        }).catch(err => {
            this.setState({
                followed: false
            });
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
                {true ? (this.state.followed ? (<div class="reply-tweet-submit-container" >
                    <Button class="btn-container" color='danger' type="block submit" onClick={this.unfollow.bind(this)}>
                        Remove Member
        </Button>
                </div>) : (<div class="reply-tweet-submit-container" >
                    <Button class="btn-container" color='primary' type="block submit" onClick={this.follow.bind(this)}>
                        Add Member
        </Button>
                </div>)) : <div></div>}
            </Col>
        </Row>)
    }
}

export default UserComponent;