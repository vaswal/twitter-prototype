import React, { Component } from 'react';
import { connect } from "react-redux";
import CanvasJSReact from '../../lib/canvasjs.react';
import { getProfileViewData } from "../../redux/actions/analyticsActions";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;

function mapStateToProps(store) {
    return {
        profileViewData: store.analytics.profileViewData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getProfileViewData: (payload) => dispatch(getProfileViewData(payload))
    };
}

class ProfileViews extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        const payload = {};
        payload.ownerId = localStorage.getItem("id")
        this.props.getProfileViewData(payload);
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
                text: "Last 30 day user profile views"
            },
            axisX: {
                title: "Dates",
                interval: 1
            },
            axisY: {
                title: "Number of views",
                labelFormatter: this.addSymbols,
            },
            data: [{
                type: "column",
                dataPoints: this.props.profileViewData
            }]
        };

        return (
            <div>
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileViews);