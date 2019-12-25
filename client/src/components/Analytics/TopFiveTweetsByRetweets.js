import React, { Component } from 'react';
import { connect } from "react-redux";
import CanvasJSReact from '../../lib/canvasjs.react';
import { PullDownContent, PullToRefresh, RefreshContent, ReleaseContent } from "react-js-pull-to-refresh";
import TweetBody from "../HomeTweetList/listview";
import { getTopTenTweetsByRetweets } from "../../redux/actions/analyticsActions";
import ViewTweets from "../Tweet/ViewTweets";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

function mapStateToProps(store) {
    return {
        topTenTweetsByRetweets: store.analytics.topTenTweetsByRetweets,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getTopTenTweetsByRetweets: (payload) => dispatch(getTopTenTweetsByRetweets(payload))
    };
}

class TopFiveTweetsByRetweets extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const payload = {};
        payload.ownerId = localStorage.getItem("id")
        this.props.getTopTenTweetsByRetweets(payload);
    }

    addSymbols(e) {
        var suffixes = ["", "K", "M", "B"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }

    render() {
        const options = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Top 5 tweets by retweets"
            },
            axisX: {
                title: "Tweets",
                reversed: true,
            },
            axisY: {
                title: "Number of retweets",
                labelFormatter: this.addSymbols,
                interval: 1,
            },
            data: [{
                type: "bar",
                dataPoints: this.props.topTenTweetsByRetweets.dataPoints
            }]
        };

        return (
            <div>
                <CanvasJSChart options={options}
                /* onRef={ref => this.chart = ref} */
                />
                <div className="container twitter-container">
                    <div className="col-lg-7">
                        <ViewTweets dataFromParent={this.props.topTenTweetsByRetweets.tweets} isDisableButtons={true}/>
                    </div>
                </div>
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopFiveTweetsByRetweets);