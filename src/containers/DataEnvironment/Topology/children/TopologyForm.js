import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {setProject} from "../../../../actions";
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";

import {Container, Form, Button, Col, InputGroup, Row, DropdownButton, FormControl} from "react-bootstrap";

class TopologyForm extends Component {
    constructor(props) {
        super(props);

    }

    createGraph = (e) => {
        e.preventDefault()

        let project = document.getElementById('project')
        let site = document.getElementById('site')
        console.log(this.props)
    }

    render() {
        return(
            <Container>
                <Form onSubmit={e => this.handleSubmit(e)}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Project Name</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control name="project" placeholder="Project Name" />
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
                    <Button onClick={this.createGraph}variant="primary" type="submit">
                        Create
                    </Button>
                </Form>
            </Container>
        )
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

export default connect(mapStateToProps, mapDispatchProps)(withAuthorization(TopologyForm));
