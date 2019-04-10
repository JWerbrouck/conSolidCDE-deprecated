import React, { Component } from 'react';
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";

class DefaultComponent extends Component {
    constructor(props) {
        super();
        this.state = {};
    }

    render() {
        return(
            <div style={divStyle}>
                <p>Placeholder with authorisation</p>
            </div>
        )
    }
}

const divStyle = {
    padding: '80px'
}

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
    }
}

export default connect(mapStateToProps)(withAuthorization(DefaultComponent));
