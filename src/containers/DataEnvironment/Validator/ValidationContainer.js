import React, { Component } from 'react';

import NoProject from '../NoProject'
import ProjectValidation from './ProjectValidation'

import {Spinner} from "react-bootstrap";

import {connect} from "react-redux";
import {setProject} from '../../../redux/actions'
import {bindActionCreators} from "redux";

import {withAuthorization} from "@inrupt/solid-react-components";


class RolesContainer extends Component {
    constructor(props) {
        super();
        this.state = {
        };
    }

    render() {
        let layout
        if (this.props.activeProject.length > 0 && this.props.loading === false && this.props.error === null) {
            layout = <ProjectValidation/>;
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

function mapDispatchProps(dispatch) {
    return bindActionCreators({setProject}, dispatch)
}

export default connect(mapStateToProps, mapDispatchProps)(withAuthorization(RolesContainer));
