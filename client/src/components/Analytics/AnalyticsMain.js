import React, {Component} from 'react';
import logo from '../../static/images/login_twitter_logo.png';
import {Switch} from 'react-router';
import {connect} from "react-redux";
import {Nav, Navbar} from "react-bootstrap";
import {Link, NavLink, Route} from "react-router-dom";
import TopTenTweetsByViews from "./TopTenTweetsByViews"
import TopTenTweetsByLikes from "./TopTenTweetsByLikes"
import TopFiveTweetsByRetweets from "./TopFiveTweetsByRetweets"
import NumberOfTweetsGraph from "./NumberOfTweetsGraph"
import ProfileViews from "./ProfileViews"

function mapStateToProps(store) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {};
}

class AnalyticsMain extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <div>
                    <Navbar>
                        <Navbar.Brand as={Link} to='/analytics'>
                            <a href="#" style={{color: "black", fontWeight: "bold"}}>
                                <img style={{width: "26px", paddingRight: "5px"}} src={logo}/>
                                Analytics
                            </a>
                        </Navbar.Brand>


                        <Nav>
                            <Nav.Link as={NavLink} to='/analytics/TopFiveTweetsByRetweets'>Top Five Tweets By
                                Retweets</Nav.Link>
                            <Nav.Link as={NavLink} to='/analytics/TopFiveTweetsByViews'>Top Ten Tweets By
                                Views</Nav.Link>
                            <Nav.Link as={NavLink} to='/analytics/NumberOfTweetsGraph'>Number Of Tweets Graph</Nav.Link>
                            <Nav.Link as={NavLink} to='/analytics/ProfileViews'>Profile View Graph</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <Nav.Link as={NavLink} to='/analytics/signOut/'>SignOut</Nav.Link>
                        </Nav>
                    </Navbar>
                </div>

                <div>
                    <Switch>
                        <Route exact path='/analytics/TopFiveTweetsByViews' component={TopTenTweetsByViews}/>
                        <Route exact path='/analytics/TopFiveTweetsByRetweets' component={TopFiveTweetsByRetweets}/>
                        <Route exact path='/analytics/NumberOfTweetsGraph/' component={NumberOfTweetsGraph}/>
                        <Route exact path='/analytics/ProfileViews/' component={ProfileViews}/>
                        {/*<Route exact path='/analytics/signOut/' component={SignOut}/>*/}
                    </Switch>
                </div>

                {((this.props.location.pathname === "/analytics") || (this.props.location.pathname === "/analytics/")) &&
                <TopTenTweetsByLikes/>
                }

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsMain);