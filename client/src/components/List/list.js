import React, { Component } from 'react';
import { PullDownContent, PullToRefresh, RefreshContent, ReleaseContent } from "react-js-pull-to-refresh";
import '../../css/list.css'
import ListBody from './listview.js'
import { connect } from "react-redux";
import { getOwnedLists, getMemberLists, getSubscribedLists } from "../../redux/actions/listActions";

function mapStateToProps(store) {
    return {
        status: store.list.status,
        data: store.list.data,
        ownedlists: store.list.ownedlists,
        subscribedList: store.list.subscribedList,
        membersList: store.list.membersList,
        currentList: store.list.currentList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getOwnedLists: (id) => dispatch(getOwnedLists(id)),
        getSubscribedLists: (id) => dispatch(getSubscribedLists(id)),
        getMemberLists: (id) => dispatch(getMemberLists(id))
    };
}

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isOwner: true,
            isSubscriber: false,
            isMember: false
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.getUser = this.getUser.bind(this)
    }

    handleRefresh() {
        //dispatch
        return new Promise((resolve) => {
            this.getUser()
        });
    }

    componentWillMount() {
        this.getUser()
    }

    getUser() {
        //fetch list
        this.props.getOwnedLists(localStorage.getItem("id"));
        this.setState({
            users: this.props.ownedlists
        });
    }

    showOwnerBox() {
        console.log("ownerBox");
        this.setState({ isOwner: true, isSubscriber: false, isMember: false });
        this.setState({
            users: this.props.ownedlists
        });
        this.props.getOwnedLists(localStorage.getItem("id"));
    }

    showSubscriberBox() {
        console.log("subscriberBox");
        this.setState({ isOwner: false, isSubscriber: true, isMember: false });
        this.setState({
            users: this.props.subscribedList
        });
        this.props.getSubscribedLists(localStorage.getItem("id"));
    }

    showMemberBox() {
        console.log("memberBox");
        this.setState({ isOwner: false, isSubscriber: false, isMember: true });
        this.setState({
            users: this.props.membersList
        });
        this.props.getMemberLists(localStorage.getItem("id"));
    }

    showContent() {
        let content
        if (this.state.users != undefined && this.state.users.length == 0) {
            content = <div>No lists</div>
        }
        else {
            content = this.state.users.map((user, index) => {
                let name = localStorage.getItem("firstName") + localStorage.getItem("lastName");
                // `${user.name.first} ${user.name.last}`;
                let handle = "@" + localStorage.getItem("username")
                //`@${user.name.first}${user.name.last}`;
                let image = user.image;
                console.log(image);
                return (
                    <ListBody
                        key={index}
                        name={name}
                        handle={handle}
                        tweet={user}
                        image={image} />

                )
            });
        }
        return content;
    }


    render() {
        return (

            <PullToRefresh
                class="list-mail-container"
                pullDownContent={<PullDownContent />}
                releaseContent={<ReleaseContent />}
                refreshContent={<RefreshContent />}
                pullDownThreshold={2}
                onRefresh={this.handleRefresh}
                triggerHeight={50}>
                <div className="main-body">
                    <div className="list-body">
                        <div className="box-controller">
                            <div
                                className={"controller " + (this.state.isOwner
                                    ? "selected-controller"
                                    : "")}
                                onClick={this
                                    .showOwnerBox
                                    .bind(this)}>
                                Owned
                            </div>
                            <div
                                className={"controller " + (this.state.isSubscriber
                                    ? "selected-controller"
                                    : "")}
                                onClick={this
                                    .showSubscriberBox
                                    .bind(this)}>
                                Subscribed
                            </div>
                            <div
                                className={"controller " + (this.state.isMember
                                    ? "selected-controller"
                                    : "")}
                                onClick={this
                                    .showMemberBox
                                    .bind(this)}>
                                Members
                            </div>
                        </div>
                    </div>
                    {/* {[...this.state.users].map((user, index) => {
                        let name = `${user.name.first} ${user.name.last}`;
                        let handle = `@${user.name.first}${user.name.last}`;
                        let image = user.image;
                        let tweet = user.tweet;
                        console.log(image);
                        return (
                            <ListBody
                                key={index}
                                name={name}
                                handle={handle}
                                tweet={tweet}
                                image={image} />
                        )
                    })} */}
                    {this.showContent()}
                </div>
            </PullToRefresh>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);

