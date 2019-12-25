import React, { Component } from 'react';
import { Redirect } from 'react-router';

class NavPage extends Component {
    render() {
        return (
            <Redirect to="/home"/>
        );
    };
}

export default NavPage;