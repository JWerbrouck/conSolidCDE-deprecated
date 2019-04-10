import React, { Component } from 'react';

import NoProject from '../NoProject'

import {Spinner} from "react-bootstrap";

import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";

import ProjectConnect from './ProjectConnect'

class ConnectContainer extends Component {
    constructor(props) {
        super();
        this.state = {
        };
    }

    render() {
        let layout
        if (this.props.activeProject.length > 0 && this.props.loading === false && this.props.error === null) {
            layout = <ProjectConnect/>;
        } else if (this.props.loading === true) {
            layout =
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>;
        } else {
            layout = <NoProject/>
        }

        return(
            <div>
                {layout}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
        // topology: state.topology.items,
        loading: state.graph.loading,
        error: state.graph.error
    }
}

export default connect(mapStateToProps)(withAuthorization(ConnectContainer));
