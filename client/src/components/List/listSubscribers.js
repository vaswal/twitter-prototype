import React from 'react';
import {Form,Modal} from "react-bootstrap";
import "../Messages/messagelist.css";
import {getSubscriberInAList} from "../../redux/actions/listActions";
import {connect} from "react-redux";


function mapStateToProps(store) {
    return {
        members: store.list.memebers
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSubscriberInAList:(id) => dispatch(getSubscriberInAList(id))
    };
}


class listSuscribers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membersModal: false,
        }
    }

    
    render() {
        return (
            <div>
                <Modal
                    show={this.state.membersModal}
                    onHide={this.cancelList}
                    animation={false}
                >
                      <Modal.Header closeButton>
                        <Modal.Title>List Members</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div class="edit-list-form">
                            <Form>
                            {/* <input maxlength="25" name="name" type="text" id="moomINPUT_1"/> */}
                                <Form.Group controlId="formGridName" >
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        name="name"
                                        placeholder="name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGridBio">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        name="description"
                                        as="textarea"
                                        rows="3"
                                        placeholder="description"
                                        value={this.state.description}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                            </Form>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(listSuscribers);
