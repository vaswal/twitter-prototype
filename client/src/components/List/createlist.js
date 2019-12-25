import React from 'react';
import { Form, Modal, Row } from "react-bootstrap";
import "../Messages/messagelist.css";
import AssignmentSharpIcon from '@material-ui/icons/AssignmentSharp';
import IconButton from '@material-ui/core/IconButton';
import { createList, addMem } from "../../redux/actions/listActions";
import { connect } from "react-redux";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';
import axios from 'axios';
import image from '../../images/profile.png';
import { HOSTNAME } from "../../constants/appConstants";
import UserComponentV2 from '../Search/User/UserComponentV2';
function mapStateToProps(store) {
    return {
        currentList: store.list.currentList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createList: (payload) => dispatch(createList(payload)),
        addMem: (payload, id) => dispatch(addMem(payload, id))
    };
}

const PaperStyle = withStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
    }
}))(Paper);

const ChipStyle = withStyles(theme => ({
    chip: {
        margin: theme.spacing(0.5)
    }
}))(Chip);

class CreateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openListModal: false,
            addMemberModal: false,
            search: [],
            chipData: [],
            buttonVal: false,
            searchString: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    newList = () => {
        this.setState({ openListModal: true });
    };
    cancelList = () => {
        this.setState({ openListModal: false });
    };
    nextModal = () => {
        this.setState({ addMemberModal: true });
    };
    cancelMember = () => {
        this.setState({ addMemberModal: false });
    };
    nextList = () => {
        //call create api
        if (this.state.name != undefined && this.state.description != undefined) {
            const payload = {
                "userId": localStorage.getItem("id"),
                "name": this.state.name,
                "description": this.state.description,
                "data": {
                    "username": localStorage.getItem("username"),
                    "firstName": localStorage.getItem("firstName"),
                    "lastName": localStorage.getItem("lastName"),
                    "userId": localStorage.getItem("id"),
                }
            }
            this.props.createList(payload);
        }
        this.nextModal();
        this.setState({
            openListModal: false
        });
    };
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        this.setState({
            buttonVal: true
        });
    }
    handleSearch(e) {
        e.preventDefault();
        console.log("handlesearch", this.state.searchString)
        this.getUser(this.state.searchString);
    };
    handleDelete = chipToDelete => () => {
        let chips = this.state.chipData
        this.setState({
            chipData: chips.filter(chip => chip.key !== chipToDelete.key)
        })
    };
    handleAdd = (e, user) => {
        e.preventDefault();
        let chips = this.state.chipData
        let newMember = { key: chips.length, label: user.username, id: user.id }
        chips.push(newMember);
        console.log(chips);
        this.setState({
            chipData: chips
        });

    };
    handleAddMembers = () => {
        console.log("this.prop.scurrent", this.props.currentList);
        // this.state.chipData.map(user => {
        //     console.log("user", user);
        //     let payload = {
        //         "id": localStorage.getItem("id"),

        //         "memberId": user.id
        //     }
        //     this.props.addMem(payload, this.props.currentList.id);
        // });
        this.setState({ addMemberModal: false });
    }
    handleChangeSearch = (e) => {
        this.setState({ searchString: e.target.value });
    }

    getUser(test) {
        console.log("getuser", test);
        axios.get(`http://${HOSTNAME}:8080/api/v1/search/users?text=${test}`)
            .then(response => {
                this.setState(
                    {
                        search: response.data.data.users
                    }, () => console.log('message response', this.state.search)
                );
            })
            .catch(err => {
                console.error(err);
            });
    };

    render() {
        let searchList = null;
        if (this.state.search.length > 0) {
            searchList = this.state.search.map(user => {
                return (
                    // <div class="list-group">
                    //     <div class="list-group-item list-group-item-action user-list row">
                    //         <div class="image-container col-sm-2"><img class="profile-image" alt="avatar"></img></div>
                    //         <div class="col-sm-10">
                    //             <button onClick={(e) => this.handleAdd(e,user)}>
                    //             <div class="profile-email">{user.username}</div> 
                    //             <div class="profile-name">{user.firstName + " " + user.lastName}</div>
                    //             </button>
                    //         </div>
                    //     </div>
                    // </div>
                    <Row>
                        <UserComponentV2
                            user={user}
                            list={this.props.currentList}
                        /></Row>
                );
            });
        }
        return (
            <div>
                <IconButton edge="end" aria-label="list" onClick={this.newList}>
                    <AssignmentSharpIcon />
                </IconButton>
                <Modal
                    show={this.state.openListModal}
                    onHide={this.cancelList}
                    animation={false}
                >
                    <Modal.Header closeButton>
                        <div class="btn-tweet">
                            <button
                                class="btn btn-primary save-btn"
                                type="button"
                                onClick={this.nextList}
                                disabled={!this.state.buttonVal}
                            >
                                Next
                            </button>
                        </div>
                        <Modal.Title>Create List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input name='name' label='Name' placeholder='Name' onChange={this.handleChange} value={this.state.name} />
                        <input name='description' label='Description' placeholder='Description' onChange={this.handleChange} value={this.state.description} />
                    </Modal.Body>
                </Modal>


                {/* *************************************NEXT MODAL************************* */}
                <Modal
                    show={this.state.addMemberModal}
                    onHide={this.cancelMember}
                    animation={false}
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <div class="btn-tweet">
                            <button
                                class="btn btn-primary save-btn"
                                type="button"
                                onClick={this.handleAddMembers}
                            >
                                Done
                            </button>
                        </div>
                        <Modal.Title>Add Members</Modal.Title>
                        {/* <div >
                        <PaperStyle>
                       {this.state.chipData.map(data => {
                            let icon;
        return (
          <ChipStyle
            key={data.key}
            icon={icon}
            label={data.label}
            onDelete={this.handleDelete(data)}
          />
        );
      })}
      
    </PaperStyle>
    </div> */}
                    </Modal.Header>
                    <Modal.Body>
                        <form class="search-body" onSubmit={e => this.handleSearch(e)}>
                            {/* <FontAwesomeIcon icon={faSearch} /> */}
                            <input type="text" placeholder="Search people" value={this.state.searchString} onChange={this.handleChangeSearch} />
                            {/* <FontAwesomeIcon icon={faSearch} /> */}
                            <div class="search-result">{searchList}</div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateList);
