import React from 'react';
import { MDBIcon } from "mdbreact";

class Search extends React.Component {
    
    search = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.props.search(e.target.value);
          }
    }

    render(){
        return (
            <div>
                <form class="form-inline">
                    <MDBIcon icon="search" />
                    <input class="form-control form-control-sm ml-0 w-100" type="text" placeholder="Search"
                        aria-label="Search" onKeyDown={this.search}/>
                </form>
            </div>
        )
    }
};

export default Search;

