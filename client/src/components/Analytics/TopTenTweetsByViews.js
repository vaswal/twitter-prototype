import React, { Component } from 'react';
import { connect } from "react-redux";
import CanvasJSReact from '../../lib/canvasjs.react';
import { PullDownContent, PullToRefresh, RefreshContent, ReleaseContent } from "react-js-pull-to-refresh";
import TweetBody from "../HomeTweetList/listview";
import ViewTweets from "../Tweet/ViewTweets"
import { getTopTenTweetsByViews } from "../../redux/actions/analyticsActions";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

function mapStateToProps(store) {
    return {
        topTenTweetsByViews: store.analytics.topTenTweetsByViews,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getTopTenTweetsByViews: (payload) => dispatch(getTopTenTweetsByViews(payload))
    };
}

class TopTenTweetsByViews extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const payload = {};
        payload.ownerId = localStorage.getItem("id")
        this.props.getTopTenTweetsByViews(payload);
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
                text: "Top 10 tweets by views"
            },
            axisX: {
                title: "Tweets",
                reversed: true,
            },
            axisY: {
                title: "Number of views",
                labelFormatter: this.addSymbols,
                interval: 1
            },
            data: [{
                type: "bar",
                dataPoints: this.props.topTenTweetsByViews.dataPoints
                // dataPoints: [
                //     { y: 2200000000, label: "Tweet 1" },
                //     { y: 1800000000, label: "Tweet 2" },
                //     { y: 800000000, label: "Tweet 3" },
                //     { y: 563000000, label: "Tweet 4" },
                //     { y: 376000000, label: "Tweet 5" },
                //     { y: 300000000, label: "Tweet 6" },
                //     { y: 250000000, label: "Tweet 7" },
                //     { y: 220000000, label: "Tweet 8" },
                //     { y: 197000000, label: "Tweet 9" },
                //     { y: 50000000, label: "Tweet 10" },
                // ]
            }]
        };

        return (
            <div>
                <CanvasJSChart options={options}
                    /* onRef={ref => this.chart = ref} */
                />
                <div className="container twitter-container">
                    <div className="col-lg-7">
                        <ViewTweets dataFromParent={this.props.topTenTweetsByViews.tweets} isDisableButtons={true}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopTenTweetsByViews);