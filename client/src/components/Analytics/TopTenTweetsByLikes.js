import React, { Component } from 'react';
import { connect } from "react-redux";
import CanvasJSReact from '../../lib/canvasjs.react';
import { getTopTenTweetsByLikes } from "../../redux/actions/analyticsActions";
import ViewTweets from "../Tweet/ViewTweets";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

function mapStateToProps(store) {
    return {
        topTenTweetsByLikes: store.analytics.topTenTweetsByLikes,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getTopTenTweetsByLikes: (payload) => dispatch(getTopTenTweetsByLikes(payload))
    };
}

class TopTenTweetsByLikes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
    }

    componentDidMount() {
        const payload = {};
        payload.ownerId = localStorage.getItem("id");
        this.props.getTopTenTweetsByLikes(payload);
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
                text: "Top 10 tweets by likes"
            },
            axisX: {
                title: "Tweets",
                reversed: true,
            },
            axisY: {
                title: "Number of likes",
                labelFormatter: this.addSymbols,
                interval: 1
            },
            data: [{
                type: "bar",
                dataPoints: this.props.topTenTweetsByLikes.dataPoints
            }]
        };

        return (
            <div>
                <CanvasJSChart options={options}
                /* onRef={ref => this.chart = ref} */
                />
                <div className="container twitter-container">
                    <div className="col-lg-7">
                        <ViewTweets dataFromParent={this.props.topTenTweetsByLikes.tweets} isDisableButtons={true}/>
                    </div>

                </div>

                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopTenTweetsByLikes);