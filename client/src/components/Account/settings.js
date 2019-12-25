import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { Card, Form, InputGroup, Button } from 'react-bootstrap';
import { getProfile } from "../../redux/actions/userActions";
import { connect } from "react-redux";
import axios from 'axios';
import { HOSTNAME } from "../../constants/appConstants";
function mapStateToProps(store) {
    return {
        userDetails: store.users.userDetails
    };
}
function mapDispatchToProps(dispatch) {
    return {
        getProfileDetails: data => dispatch(getProfile(data))
    }
}

class settings extends Component {
    constructor(props) {
        super(props);
        this.state = { collapseID: "collapse3", validated: false }
    }
    componentWillMount = () => {
        const data = {
            user_id: localStorage.getItem('id')
        };
        this.props.getProfileDetails(data);
    }
    deactivateAccount = () => {
        var headers = {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
        };
        let user_id = localStorage.getItem('id');
        axios.put(`http://${HOSTNAME}:8080/api/v1/user/${user_id}/deactivate`, { headers: headers })
            .then(res => {
                if (res.data.status === "ok") {
                    alert("You have been de-activated, you will be logged out. ");
                    //// logout to go here 
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    changePassword = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {

            const Updatedata = {};
            // if
            for (let i = 0; i < e.target.length; i++) {
                if (e.target[i].id !== "") {
                    Updatedata[e.target[i].id] = e.target[i].value;
                }
            }
            if (Updatedata.formNewPassword === Updatedata.formConfirmPassword) {
                let data = {
                    id: localStorage.getItem('id'),
                    password: Updatedata.formNewPassword,
                    currentPassword: Updatedata.formCurrPassword
                }
                var headers = {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token")
                };
                axios.put(`http://${HOSTNAME}:8080/api/v1/user/update`, data, { headers: headers })
                    .then(res => {
                        if (res.data.status === "ok") {
                            alert("password updated successfully");
                            for (let i = 0; i < e.target.length; i++) {
                                e.target[i].value = "";
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                alert("Password and Confirm Password do not match. ");
                for (let i = 0; i < e.target.length; i++) {
                    e.target[i].value = "";
                }
            }
        }
        this.setState({ validated: true });
    }
    toggleCollapse = collapseID => () =>
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        }));
    render() {
        let usrDetails = this.props.userDetails ? this.props.userDetails : [];
        let userData = usrDetails.data ? usrDetails.data : [];
        const { collapseID } = this.state;
        let collapsable = (
            <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        Username
            </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Form><Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control value={usrDetails.username ? usrDetails.username : ""} readOnly="true" />
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    You are not allowed to change your username.
                                    </Form.Text>
                            </Form.Group></Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        Phone Number
            </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <Form><Form.Group controlId="formBasicPhone">
                                <Form.Label>Phone Number</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend">+1</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control placeholder={userData.phoneNum ? userData.phoneNum : "935825561"} />
                                </InputGroup>
                                <Form.Text className="text-muted">

                                </Form.Text>
                            </Form.Group></Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                        Email
             </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body><Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={usrDetails.email ? usrDetails.email : ""} readOnly="true" />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else. Your email is not editable.
                            </Form.Text>
                        </Form.Group></Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="3">
                        Password
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="3">
                        <Card.Body><Form onSubmit={this.changePassword} noValidate validated={this.state.validated}>
                            <Form.Group controlId="formCurrPassword">
                                <Form.Label>Current Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required />
                            </Form.Group>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required />
                            </Form.Group>
                            <Form.Group controlId="formConfirmPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form></Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="4">
                        Deactivate Your Account
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="4">
                        <Card.Body><div class="text-message">You’re about to start the process of deactivating your Twitter account. Your display name, @username, and public profile will no longer be viewable on Twitter.com, Twitter for iOS, or Twitter for Android.</div>
                            <Button variant="danger" type="submit" onClick={this.deactivateAccount}>
                                Deactivate Account
                            </Button>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>);
        return (
            <div class="settings-list-container col-sm-12">
                <div class="account-heading row">Account</div>
                <hr></hr>
                <div class="login-heading row">Login and Security</div>
                <hr></hr>
                <div>{collapsable}</div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(settings);