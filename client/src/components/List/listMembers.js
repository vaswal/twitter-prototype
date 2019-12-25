import React from 'react';
import { Form, Modal } from "react-bootstrap";
import "../Messages/messagelist.css";
import { removeMem, getMemberInAList } from "../../redux/actions/listActions";
import { connect } from "react-redux";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
function mapStateToProps(store) {
    return {
        members: ["heelo","yellow","bellow","tello"]
    }
}

function mapDispatchToProps(dispatch) {
    return {
        removeMem: (payload) => dispatch(removeMem(payload)),
        getMemberInAList: (id) => dispatch(getMemberInAList(id))
    };
}

const handleListItemClick = (event, index) => {
    console.log("clicked")
  };

const handleToggle = (event,index) => {
    console.log("toggle")
  };

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  
class listMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            membersModal: true,
        }
    }

    getList = () => {
        return(
        <div>
          <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText primary="Trash" />
        </ListItem>
        <ListItemLink href="#simple-list">
          <ListItemText primary="Spam" />
        </ListItemLink>
      </List>
                </div>
            );
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
                        <div style={{}}>
                            <List component="nav" aria-label="secondary mailbox folder">
                                {this.getList()}
                            </List>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(listMembers);
