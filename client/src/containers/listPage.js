import React, {Component} from 'react';
import '../css/list.css'
import Sidebar from '../components/Sidebar/sidebar.js'
import List from '../components/List/list.js'
import Search from '../components/List/search.js'
import CreateList from '../components/List/createlist.js';
import GridLayout from 'react-grid-layout';

class ListPage extends Component {

    render() {
        return (
            <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
                <div key="a" data-grid={{x: 0, y: 0, w: 5, h: 2, static: true}}><Sidebar/></div>
                <div key="b" data-grid={{x: 10, y: 0, w: 8, h: 2, static: true}}>
                    <h2>List</h2>
                    <CreateList/>
                    <List/>
                </div>
                <div key="c" data-grid={{x: 5, y: 0, w: 3, h: 2, static: true}}><Search/></div>
            </GridLayout>
        );
    }
}

export default ListPage;

