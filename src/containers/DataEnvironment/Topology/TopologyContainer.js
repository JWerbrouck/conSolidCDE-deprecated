import React, { Component } from 'react';

import NoProject from '../NoProject'
import ProjectTopology from './ProjectTopology'

import {connect} from "react-redux";
import {setProject} from '../../../actions'
import {bindActionCreators} from "redux";

import {withAuthorization} from "@inrupt/solid-react-components";


class TopologyContainer extends Component {
    constructor(props) {
        super();
        this.state = {
        };
    }

    componentDidMount() {
        console.log('myprops:', this.props)
    }

    render() {
        let layout
        if (this.props.activeProject.length > 0) {
            layout = <ProjectTopology/>
            return layout
        } else {
            layout = <NoProject/>
            return layout
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
        topology: state.topology.items,
        loading: state.topology.loading,
        error: state.topology.error
    }
}

function mapDispatchProps(dispatch) {
    return bindActionCreators({setProject}, dispatch)
}

export default connect(mapStateToProps, mapDispatchProps)(withAuthorization(TopologyContainer));
