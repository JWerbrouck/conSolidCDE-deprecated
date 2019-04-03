import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {setProject} from "../../../actions";
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";

import {Container, Row, Col} from "react-bootstrap";
import TopologyForm from './children/TopologyForm'
import TopologyGraph from './children/TopologyGraph'

class ProjectTopology extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return(
            <div style={divStyle}>
                <Row>
                    <Col>
                        <TopologyForm/>
                    </Col>
                    <Col>
                        <TopologyGraph/>
                    </Col>
                </Row>
            </div>
        )
    }
}

const divStyle = {
    padding: '80px'
}

function mapStateToProps(state) {
    return {
        activeProject: state
    }
}

function mapDispatchProps(dispatch) {
    return bindActionCreators({setProject}, dispatch)
}

export default connect(mapStateToProps, mapDispatchProps)(withAuthorization(ProjectTopology));
