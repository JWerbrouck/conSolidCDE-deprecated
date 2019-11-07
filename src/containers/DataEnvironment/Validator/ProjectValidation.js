import React, { Component } from 'react';
import SHACLValidator from "shacl-js"

import {connect} from "react-redux";
import {Form, InputGroup, Col, Row, Button} from "react-bootstrap";
import {withAuthorization} from "@inrupt/solid-react-components";

const $rdf = require('rdflib');

class ProjectValidation extends Component {
    constructor(props) {
        super();
        this.state = {
            shape: 'https://jwerbrouck.solid.community/public/myProjects/SHACLshapes/geoLocationShape.ttl',
            validationResults: []
        };
    }

    componentDidMount() {
        let store = this.props.graph;
        let stakeholderGraph = this.props.activeProject.split("myProjects/")
        stakeholderGraph = this.props.activeProject + 'stakeholders.ttl'
        this.setState({stakeholderGraph: stakeholderGraph})
        let stakeholderGraphLib = store.sym(stakeholderGraph)
        this.setState({stakeholderGraphLib: stakeholderGraphLib})
    }

    nameChanged = (e) => {
        this.setState({shape: e.target.value}, () => {console.log(this.state.shape)})
    }

    startValidation = (e) => {
        e.preventDefault()
        let stakeholders = this.fetchStakeholders();
        let totalGraph = this.fetchPartialGraphs(stakeholders)
    }

    fetchStakeholders = () => {
        // fetch the stakeholders from the main props graph
        let store = this.props.graph
        let uniqueStakeholders = []
        let stakeholders = store.match(null, null, null, this.state.stakeholderGraphLib.doc())
        stakeholders.forEach((stakeholder) => {
        if (!uniqueStakeholders.includes(stakeholder.subject)){
                uniqueStakeholders.push(stakeholder.subject)
            }
        })
        return uniqueStakeholders
    }

    fetchPartialGraphs = (stakeholders) => {
        // fetch the graphs based on the stakeholders in the store
        const fullStore = $rdf.graph();
        let fetcher = new $rdf.Fetcher(fullStore)
        let project = this.props.activeProject.split("/")
        let projectName = project[project.length - 2]
        let graphs = []
        stakeholders.forEach((st) => {
            st = st.value.replace('profile/card#me', 'public/myProjects/' + projectName + "/" + projectName + '.ttl')
            graphs.push(st)
        })

        let itemsProcessed = 0;

        graphs.forEach((graph) => {
            fetcher.load(fullStore.sym(graph))
                .then(r => {
                    itemsProcessed++;
                    if (itemsProcessed == graphs.length) {
                        let graphSym = []
                        graphs.forEach(graph => {
                            graph = fullStore.sym(graph)
                            graphSym.push(graph)
                        })
                        this.projectGraph(fullStore, graphSym)
                    }
                })
        })

    }

    projectGraph = (store, graphs) => {
        let triples = []
        graphs.forEach(graph => {
                let trips = store.match(null, null, null, graph.doc())
                trips.forEach(triple => {triples.push(triple)})
            })

        const finalStore = $rdf.graph();
        triples.forEach(t => {
            finalStore.add(t)
        })

        this.setState({fullGraph: $rdf.serialize(null, finalStore, this.props.activeProject, 'text/turtle')}, () => {this.fetchShapes()})

    }

    fetchShapes = () => {
        const shapeStore = $rdf.graph();
        let shapeFetcher = new $rdf.Fetcher(shapeStore);
        shapeFetcher.load(shapeStore.sym(this.state.shape))
            .then(response => {
                this.setState({shapeGraph: response.responseText}, () => {this.validate()})
            })
    }

    validate = () => {
        let graph = this.state.fullGraph;
        console.log(graph)
        let shape = this.state.shapeGraph;
        console.log(shape)
        let validator = new SHACLValidator();
        this.setState({validationResults: []})
        validator.validate(graph, "text/turtle", shape, "text/turtle", (e, report) => {
            console.log(report)
            console.log("Conforms? " + report.conforms());
            if (report.conforms() === false) {
                report.results().forEach((result) => {
                    console.log("Severity: " + result.severity() + " for " + result.sourceConstraintComponent());
                    console.log("message: " + result.message())
                    this.setState({validationResults: [...this.state.validationResults, result]}, () => {console.log(this.state.validationResults)})
                    this.setState({passedValidation: false})
                });
            } else if (report.conforms() === true) {
                this.setState({passedValidation: true})
            }
        });
    }

    printState =() => {
        console.log(this.state)
    }

    render() {
        let messages
        if (this.state.passedValidation === false) {
                messages = this.state.validationResults.map((result) => {
                    return (
                        <div>
                            <p key={result}>{result.message()}</p>
                            <p className="text-danger">{result.focusNode().split("/")[result.focusNode().split("/").length - 1]} does
                                not comply</p>
                            <hr/>
                        </div>
                    )
                })
        } else if (this.state.passedValidation === true) {
            messages = <p className="text-success">Passed all tests</p>
        } else {
            messages = <p>No tests performed</p>
        }

        return(
            <div style={divStyle}>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group as={Row}>
                                <Form.Label column sm={2}>Shape URL</Form.Label>
                                <Col sm={10}>
                                    <InputGroup>
                                        <Form.Control
                                            type="url"
                                            defaultValue="https://jwerbrouck.solid.community/public/myProjects/SHACLshapes/geoLocationShape.ttl"
                                            name="shape"
                                            id='shape'
                                            placeholder="Shape URL"
                                            onChange={e => this.nameChanged(e)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid URL.
                                        </Form.Control.Feedback>
                                        <InputGroup.Append>
                                            <Button type="submit" variant="dark" onClick={this.startValidation}>Validate</Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <hr/>
                <hr/>
                <Row>
                    <Col>
                        <h6>Validation Results:</h6>
                        <hr/>
                        {messages}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={this.printState}justify="right" variant="dark" size="sm">Notify responsible stakeholders!</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

const divStyle = {
    padding: '100px'
}

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
        graph: state.graph.graph
    }
}

export default connect(mapStateToProps)(withAuthorization(ProjectValidation));
