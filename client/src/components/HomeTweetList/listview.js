import React, { Component } from "react";
import '../../css/hometweetlist.css';
import { Route, Redirect } from 'react-router-dom';
import { useHistory } from "react-router-dom";


class TweetBox extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <div className="tweet-body" >
                {this.props.children}
            </div>
        )
    }

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

const IsRetweeted = (props) => {
    return (
        <div className="handle">
            {props.isRetweeted}
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

const Tweet = (props) => {
    return (
        <div className="tweet">
            {props.tweet}
        </div>
    )
};

const CreatedAt = (props) => {
    return (
        <div className="createdAt">
            {props.createdAt}
        </div>
    )
};

// const TweetBody = (props) => {
//     return (
//         <div class="list-group">
//             <TweetBox onClick={(e) => this.displayTweet(e)}>
//                 <button type="button" className="inner-body list-group-item list-group-item-action">
//                     <Image image={props.image} />
//                     <div className="body">
//                         <div className="inner-body-inner">
//                             <Name name={props.name} />
//                             <Handle handle={props.handle} />
//                         </div>
//                         <Tweet tweet={props.tweet} />
//                     </div>
//                 </button>
//             </TweetBox>
//             <TweetBox>
//                 <button type="button" className="inner-body list-group-item list-group-item-action">
//                     <Image image={props.image} />
//                     <div className="body">
//                         <div className="inner-body-inner">
//                             <Name name={props.name} />
//                             <Handle handle={props.handle} />
//                         </div>
//                         <Tweet tweet={props.tweet} />
//                     </div>
//                 </button>
//             </TweetBox>
//         </div>
//     )
// };



class TweetBody extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectToTweet: false
        }
        this.displayTweet = this.displayTweet.bind(this);
    }

    displayTweet(id) {

        if (this.props.setTweet) {
            this.props.setTweet(id);
        } else {
            try {
                document.querySelector("#root > div > div > div > div > div.col-lg-3 > div > div > div > button:nth-child(8)").setAttribute("data-tweet-id", this.props.id);
                document.querySelector("#root > div > div > div > div > div.col-lg-3 > div > div > div > button:nth-child(8)").click();
            }
            catch (e) {
                console.log(e);
            }
        }

    }

    render() {


        return (
            <div class="list-group">
                <button type="button" className="inner-body list-group-item list-group-item-action" onClick={(e) => this.displayTweet(this.props.id)}>
                    {
                        this.props.image ? this.props.image === "undefined" ? (<Image image="https://thefader-res.cloudinary.com/private_images/w_760,c_limit,f_auto,q_auto:best/TwitterLogo__55acee_jntmic/twitter-applications-verified.jpg" />) : (<Image image={this.props.image} />) : (<Image image="https://thefader-res.cloudinary.com/private_images/w_760,c_limit,f_auto,q_auto:best/TwitterLogo__55acee_jntmic/twitter-applications-verified.jpg" />)
                    }

                    <div className="body">
                        <div className="inner-body-inner">
                            <Name name={this.props.name} />
                            <Handle handle={this.props.handle} />
                            {this.props.createdAt !== undefined && <CreatedAt createdAt={this.props.createdAt} />}
                        </div>
                        <Tweet tweet={this.props.tweet} />
                    </div>
                </button>

            </div>
        )
    }

}

export default TweetBody;