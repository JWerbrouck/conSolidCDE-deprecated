import React, { Component } from 'react';
import {Button} from "react-bootstrap";

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

    printProps = () => {
        console.log('myprops:', this.props)
    }

    render() {
        let layout
        if (this.props.activeProject) {
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
        activeProject: state
    }
}

function mapDispatchProps(dispatch) {
    return bindActionCreators({setProject}, dispatch)
}

export default connect(mapStateToProps, mapDispatchProps)(withAuthorization(TopologyContainer));
