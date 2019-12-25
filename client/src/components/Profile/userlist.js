import React, { Component } from 'react';
import { Form, Modal, Button } from "react-bootstrap";
import UserList from '../Search/User/UserList';
class userlist extends Component {
    constructor(props) {
        super(props);
        this.state = { showModal: true }
        console.log("props from parent :", this.props);
    }
    closeModal = () => {

        this.setState({ showModal: false })
        this.props.closeList();
    }
    render() {
        return (<Modal
            show={this.state.showModal}
            onHide={this.closeModal}
            animation={false}
            scrollable={true}
        >
            <Modal.Header closeButton>

                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <UserList
                    users={this.props.users}
                    profile={this.props.profile}
                    getUsers={this.props.getUsers}
                    hasMore={this.props.hasMore}

                />
            </Modal.Body>
        </Modal>);
    }
}

export default userlist;