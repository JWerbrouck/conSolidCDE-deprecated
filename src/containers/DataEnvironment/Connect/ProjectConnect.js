import React, { Component } from 'react';
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";

import DocumentSelector from './children/DocumentSelector'

import {Row, Col} from "react-bootstrap";

class ProjectConnect extends Component {
    render() {
        return(
            <div style={divStyle}>
                <Row>
                    <Col>
                        <DocumentSelector/>
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
        activeProject: state.activeProject.url,
    }
}

export default connect(mapStateToProps)(withAuthorization(ProjectConnect));
