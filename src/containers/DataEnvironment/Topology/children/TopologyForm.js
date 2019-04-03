import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {updateTopology} from "../../../../redux/actions/fetchTopology";
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";

import {Container, Form, Button, Col, InputGroup, Row, DropdownButton, FormControl} from "react-bootstrap";

class TopologyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topology: this.props.topology
        }
    }

    componentDidMount() {
        console.log(this.props)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props)
    }

    createGraph = (e) => {
        e.preventDefault()

        let project = document.getElementById('project')
        let site = document.getElementById('site')
        console.log(this.props)
    }

    nameChanged = (e, path) => {
        console.log('first state', this.props.topology)
        let topoCopy = path
        let newUri = topoCopy.uri.split("#")[0]
        newUri = newUri + '#' + e.target.value

        topoCopy.newUri = newUri
        topoCopy.shortName = e.target.value

        if (e.target.name === "building") {
            this.state.activeBuilding = e.target.value
        } else if (e.target.name === "storey") {
            this.state.activeStorey = e.target.value
        } else if (e.target.name === "space") {
            this.state.activeSpace = e.target.value
        }

        this.setState({path: topoCopy}, () => {
            this.props.dispatch(updateTopology(this.state.topology))
        });
    }


    // nameChanged = (e, location) => {
    //     this.props.dispatch(updateTopology(e, location, this.props.topology))
    // }

    render() {
        return(
            <Container>
                <Form onSubmit={e => this.handleSubmit(e)}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Project Name</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    value={this.props.topology.project.shortName}
                                    name="project"
                                    placeholder="Project Name"
                                    onChange={e => this.nameChanged(e, this.props.topology.project)}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Site Name</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control name="site" placeholder="Site Name" />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Buildings</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <DropdownButton as={InputGroup.Prepend} variant="dark" title="" id="input-group-dropdown-2" >
                                    buildings
                                </DropdownButton>
                                <FormControl name="building" placeholder="New Building"/>
                                <InputGroup.Append><Button variant="dark">Add</Button></InputGroup.Append>
                                <InputGroup.Append><Button variant="dark">Remove</Button></InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Storeys</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <DropdownButton as={InputGroup.Prepend} variant="dark" title="" id="input-group-dropdown-2" >
                                    storeys
                                </DropdownButton>
                                <FormControl name="storey" placeholder="New Storey"/>
                                <InputGroup.Append><Button variant="dark">Add</Button></InputGroup.Append>
                                <InputGroup.Append><Button variant="dark">Remove</Button></InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Spaces</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <DropdownButton as={InputGroup.Prepend} variant="dark" title="" id="input-group-dropdown-2" >
                                    spaces
                                </DropdownButton>
                                <FormControl name="space" placeholder="New Space"/>
                                <InputGroup.Append><Button variant="dark">Add</Button></InputGroup.Append>
                                <InputGroup.Append><Button variant="dark">Remove</Button></InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Button onClick={this.createGraph} variant="primary" type="submit">
                        Create
                    </Button>
                </Form>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
        topology: state.topology.topology,
        loading: state.topology.loading,
        error: state.topology.error
    }
}

export default connect(mapStateToProps)(withAuthorization(TopologyForm));
