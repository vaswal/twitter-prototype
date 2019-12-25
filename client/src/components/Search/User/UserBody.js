import React, { Component } from "react";
import '../../../css/hometweetlist.css';
const UserBox = (props) => {
    return (
        <div className="tweet-body">
            {props.children}
        </div>
    )
};

const Image = (props) => {
    return (
        <img src={props.image} alt="Logo" className="picture">
        </img>
    )
};

const Handle = (props) => {
    return (
        <div className="handle">
            {props.handle}
        </div>
    )
};

const Name = (props) => {
    return (
        <div className="name">
            {props.name}
        </div>
    )
};


class UserBody extends Component {
    constructor(props) {
        super(props);
        this.displayUserProfile = this.displayUserProfile.bind(this);
    }

    displayUserProfile(id) {
        console.log("ID >>>>>> ", id);
        try {
            document.querySelector("#root > div > div > div > div > div.col-lg-3 > div > div > div > button:nth-child(12)").setAttribute("data-user-profile-props", JSON.stringify(this.props.user));
            document.querySelector("#root > div > div > div > div > div.col-lg-3 > div > div > div > button:nth-child(12)").click();
        }
        catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <div class="list-group">
                <UserBox>
                    <button type="button" className="inner-body list-group-item list-group-item-action" onClick={(e) => this.displayUserProfile(this.props)}>
                        {this.props.user.data && this.props.user.data.profileImage ? (<Image image={this.props.user.data.profileImage} />) : (<Image image="https://thefader-res.cloudinary.com/private_images/w_760,c_limit,f_auto,q_auto:best/TwitterLogo__55acee_jntmic/twitter-applications-verified.jpg" />)}

                        <div className="body">
                            <div className="inner-body-inner">
                                <Name name={this.props.user.firstName + " " + this.props.user.lastName} />
                                <Handle handle={`@${this.props.user.username}`} />
                            </div>
                        </div>
                    </button>
                </UserBox>
            </div>
        )
    };
}

export { UserBody }