import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Button, Row, Col } from 'reactstrap';


import { ListBody } from './ListBody';
import { HOSTNAME } from "../../../constants/appConstants";
const API_PATH = `http://${HOSTNAME}:8080/api/v1`

class ListComponent extends Component {
    state = {
        subscribed: this.props.list.subscribed,
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

    subscribe = (subscriberId) => {
        axios.put(API_PATH + `/list/${this.props.list.id}/subscribe`, { subscriberId:this.props.callerId }, this.tokenConfig()).then(res => {
            if (res.data.status) {
                this.setState({
                    subscribed: true
                });
            }
        }).catch(err => {
            console.log(err);
        });

    }

    unsubscribe = (subscriberId) => {
        axios.put(API_PATH + `/list/${this.props.list.id}/unsubscribe`, { subscriberId:this.props.callerId }, this.tokenConfig()).then(res => {
            if (res.data.status) {
                this.setState({
                    subscribed: false
                });
            }
        }).catch(err => {
            console.log(err);
        });

    }

    render() {
        console.log(this.props.list);
        return (<Row>
            <Col className="col-9">
            <div className="inner-body list-group-item-action">
                <ListBody
                    list={this.props.list}
                />
                </div>
            </Col>
            <Col className="text-right my-auto">
                {this.props.callerId ? (!this.state.subscribed ? (<div class="reply-tweet-submit-container" >
                    <Button class="btn-container" color='danger' type="submit" onClick={this.subscribe.bind(this)}>
                        Subscribe
        </Button>
                </div>) : (<div class="reply-tweet-submit-container" >
                    <Button class="btn-container" color='primary' type="submit" onClick={this.unsubscribe.bind(this)}>
                        Unsubscribe
        </Button>
                </div>)) : <div></div>}
            </Col>
        </Row>)
    }
}

export default ListComponent;