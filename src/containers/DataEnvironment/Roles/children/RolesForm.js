import React, { Component } from 'react';
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";
import Select from 'react-select'
import {Row, Col, Button, Form, InputGroup} from "react-bootstrap";
import {RDF, CS} from "../../../../sparql/namespaces";

const options = [
    { value: 'manager', label: 'Project Manager' },
    { value: 'architect', label: 'Architect' },
    { value: 'hvac', label: 'HVAC engineer' },
    { value: 'structural', label: 'Structural engineer' }
];

class ProjectRoles extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedOption: null,
            roles: []
        };
    }

    componentDidMount() {
        let store = this.props.graph

        let roleGraph = this.props.activeProject + 'stakeholders.ttl'
        this.setState({roleGraph: roleGraph})
        let roleGraphLib = store.sym(roleGraph)
        this.setState({roleGraphLib: roleGraphLib})

        console.log(this.state)

        let stakeholders = store.match(null, RDF('type'), null, roleGraphLib.doc())
        let stakeholderList = {}
        stakeholders.forEach(stakeholder => {
            console.log(stakeholder)
            let name = stakeholder.subject
            if (!Object.keys(stakeholderList).includes(name.value)) {
                console.log('stakeholder not in list yet')
                stakeholderList[name.value] = [];
            }
            let role = stakeholder.object
            console.log('role', role)
            role = role.value.replace('https://consolid.com/roledefinitions#', '')

            if (!stakeholderList[name.value].includes(role)) {
                stakeholderList[name.value].push(role)
            }
        })
        console.log('stakeholders:', stakeholderList)
        this.setState({stakeholders: stakeholderList})
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    }



    render() {
        return(
            <div style={divStyle}>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Stakeholder</Form.Label>
                        <Col sm={6}>
                            <InputGroup>
                                <Form.Control
                                    value={this.state.projectActive}
                                    name="project"
                                    id='project'
                                    placeholder="Stakeholder webID"
                                />
                            </InputGroup>
                        </Col>
                        <Col sm={4}>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange}
                                options={options}
                                placeholder='Roles'
                                isMulti
                            />
                        </Col>
                    </Form.Group>
                </Form>

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
        graph: state.graph.graph
    }
}

export default connect(mapStateToProps)(withAuthorization(ProjectRoles));
