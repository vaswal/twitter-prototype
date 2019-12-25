import React, { Component } from 'react';
import { connect } from "react-redux";
import CanvasJSReact from '../../lib/canvasjs.react';
import { getNumberOfHourlyTweets, getNumberOfDailyTweets, getNumberOfMonthlyTweets } from "../../redux/actions/analyticsActions";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

function mapStateToProps(store) {
    return {
        numberOfHourlyTweets: store.analytics.numberOfHourlyTweets,
        numberOfDailyTweets: store.analytics.numberOfDailyTweets,
        numberOfMonthlyTweets: store.analytics.numberOfMonthlyTweets,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getNumberOfHourlyTweets: (payload) => dispatch(getNumberOfHourlyTweets(payload)),
        getNumberOfDailyTweets: (payload) => dispatch(getNumberOfDailyTweets(payload)),
        getNumberOfMonthlyTweets: (payload) => dispatch(getNumberOfMonthlyTweets(payload)),
    };
}

class NumberOfTweetsGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
    }

    componentWillMount() {
        const payload = {};
        payload.ownerId = localStorage.getItem("id")
        this.props.getNumberOfHourlyTweets(payload);
        this.props.getNumberOfDailyTweets(payload);
        this.props.getNumberOfMonthlyTweets(payload);
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
        const hourlyOptions = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Number of tweets graph"
            },
            axisX: {
                title: "Hours",
                interval: 1,
            },
            axisY: {
                title: "Number of tweets",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "column",
                dataPoints: this.props.numberOfHourlyTweets
                // dataPoints: [
                //     { y: 2200000000, label: "Tweet 1" },
                //     { y: 1800000000, label: "Tweet 2" },
                //     { y: 800000000, label: "Tweet 3" },
                //     { y: 563000000, label: "Tweet 4" },
                //     { y: 376000000, label: "Tweet 5" },
                // ]
            }]
        };

        const dailyOptions = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Number of tweets graph"
            },
            axisX: {
                title: "Days",
                interval: 1
            },
            axisY: {
                title: "Number of tweets",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "column",
                dataPoints: this.props.numberOfDailyTweets
                // dataPoints: [
                //     { y: 2200000000, label: "Tweet 1" },
                //     { y: 1800000000, label: "Tweet 2" },
                //     { y: 800000000, label: "Tweet 3" },
                //     { y: 563000000, label: "Tweet 4" },
                //     { y: 376000000, label: "Tweet 5" },
                // ]
            }]
        };

        const monthlyOptions = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Number of tweets graph"
            },
            axisX: {
                title: "Months",
                interval: 1
            },
            axisY: {
                title: "Number of tweets",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "column",
                dataPoints: this.props.numberOfMonthlyTweets
            }]
        };

        return (
            <div>
                <CanvasJSChart options={hourlyOptions}/>
                <CanvasJSChart options={dailyOptions}/>
                <CanvasJSChart options={monthlyOptions}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NumberOfTweetsGraph);