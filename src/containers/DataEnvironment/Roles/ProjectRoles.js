import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";
import RolesForm from './children/RolesForm'

import {Row, Col} from "react-bootstrap";

class ProjectRoles extends Component {
    render() {
        return(
            <div style={divStyle}>
                <Row>
                    <Col>
                        <RolesForm/>
                    </Col>
                    {/*<Col>*/}
                    {/*<TopologyGraph/>*/}
                    {/*</Col>*/}
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

export default connect(mapStateToProps)(withAuthorization(ProjectRoles));
