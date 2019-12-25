import React, { Component } from 'react';
import logo from '../../static/images/login_twitter_logo.png';
import { signIn } from "../../redux/actions/authActions";
import { connect } from "react-redux";
import { Button, Form, Toast } from "react-bootstrap";
import { Redirect } from "react-router";
import Expire from "./Expire";

function mapStateToProps(store) {
    return {
        signinSuccess: store.auth.signinSuccess,
        signinMessage: store.auth.signinMessage,
        userActive: store.auth.userActive
    }
}

function mapDispatchToProps(dispatch) {
    return {
        signIn: (payload) => dispatch(signIn(payload))
    };
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectVar: false, date: null
        }
    }

    signIn = (e) => {
        e.preventDefault();
        const data = {};
        for (let i = 0; i < e.target.length; i++) {
            if (e.target[i].id !== "") {
                data[e.target[i].id] = e.target[i].value;
            }
        }
        this.setState({ date: new Date().getTime() })
        this.props.signIn(data);
    };


    render() {
        return (
            <div style={styles.container}>
                {this.state.redirectVar === true && <Redirect to={{
                    pathname: "/signup"
                }} />}
                {this.props.signinSuccess === true && localStorage.getItem('userActive') !== 'false' && <Redirect to={{
                    pathname: "/home"
                }} />}
                {
                    this.props.signinSuccess === true && localStorage.getItem('userActive') === 'false' && <Redirect to={{
                        pathname: "/reactivate"
                    }} />}
                {this.props.signinSuccess === false &&
                    <Toast>
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                            <strong className="mr-auto">Notification</strong>
                        </Toast.Header>
                        <Toast.Body>{this.props.signinMessage}</Toast.Body>
                    </Toast>}

                <div>
                    <img style={styles.logo} src={logo} alt="Quora" />
                </div>
                <h3 style={styles.message}>Log in to Twitter</h3>
                <Form onSubmit={this.signIn}>
                    <div style={styles.email}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control placeholder="Enter your username" required />
                        </Form.Group>
                    </div>

                    <div style={styles.email}>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter your password" required />
                        </Form.Group>
                    </div>
                    <div>
                        <Button style={styles.loginButton} variant="primary" type="submit">
                            Log in
                        </Button>
                    </div>

                    <div style={styles.signUpBox}>
                        <Form.Row>
                            <Form.Label style={{ paddingTop: 10, paddingRight: 5 }}>New to Twitter?</Form.Label>

                            <Button style={styles.signUpButton} variant="primary" onClick={() => this.setState({ redirectVar: true })}>
                                Sign up
                            </Button>
                        </Form.Row>
                    </div>
                </Form>
            </div>
        );
    }
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
    },
    message: {
        fontWeight: "bold",
        paddingTop: "2rem"
    },
    logo: {
        paddingTop: "10px",
        width: "50px",
    },
    email: {
        width: "30rem",
    },
    loginButton: {
        width: "30rem",
        backgroundColor: "#2F99EA"
    },
    signUpBox: {
        marginTop: 40
    },
    signUpButton: {
        backgroundColor: "#2F99EA"
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

