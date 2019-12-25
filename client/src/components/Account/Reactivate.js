import React, { Component } from 'react';
import { Card, Form, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './Account.css';
import logo from '../../static/images/login_twitter_logo.png';
import { HOSTNAME } from "../../constants/appConstants";
class Reactivate extends Component {
    constructor(props) {
        super(props);
        this.state = { toLogout: false, toHome: false }
    }
    logout = () => {
        //logout here
        console.log("logout state::::::");
        this.setState({ toLogout: true });
        localStorage.clear();
        //localStorage.setItem('userActive', 'truee');
    }
    activateAccount = () => {
        // call activate account 
        let user_id = localStorage.getItem('id');
        var headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        };
        axios.put(`http://${HOSTNAME}:8080/api/v1/user/${user_id}/reactivate`, { headers: headers })
            .then(res => {
                console.log("test result :", res);
                if (res.data.status === "ok") {
                    localStorage.setItem('userActive', true)
                    alert("You have been re-activated.");
                }
            }).then(() => {
                this.setState({ toHome: true })
            })
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        if (this.state.toHome) {
            return <Redirect to='/home' />
        } else if (this.state.toLogout) {
            return <Redirect to='/login' />
        }

        return (<div>
            <div class="reactivate-container col-sm-12">
                <div>
                    <img class="img-logo" src={logo} alt="Quora" width="50px" />
                </div>
                <h3 class="message-row">Reactivate Account </h3>
                <div class="row">
                    <div class="message-row-text ">Your account was previously deactivated, please activate it before proceeding any further.
                    </div>
                </div>
                <div class="spacer-element row"></div>
                <div class="reactivate-btn-container">
                    <Button variant="outline-primary" size="lg" block onClick={this.activateAccount}>Reactivate Account</Button>
                    <Button variant="outline-danger" size="lg" block onClick={this.logout}>Cancel</Button>
                </div>
            </div>
        </div>);
    }
}

export default Reactivate;