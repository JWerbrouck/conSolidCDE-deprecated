import React, {Component} from "react";
import { Navigation, Toolbar } from "./children";
import {Navbar, Dropdown, Button, Modal, Form, Row, Col, InputGroup} from 'react-bootstrap'
import { withAuthorization } from '@inrupt/solid-react-components';
import {BOT, STG, RDF, FOAF} from "../../sparql/namespaces";

import {connect} from "react-redux";
import {setProject} from '../../redux/actions/setActiveProject'
import {fetchTopology, fetchGraph} from "../../redux/actions/fetchTopology";

const fileClient = require('solid-file-client');
const $rdf = require('rdflib');

type Props = { navigation: Array<Object>, toolbar: Array<React.Node> };

class NavBar extends Component {
    constructor(props: Props) {
        super();
        this.state = {
            myProjects: [],
            showNewProject: false,
            projectModal: false
        };
    }

    componentDidMount() {
        //fetch the projects in the Private/myProjects folder of my webID
        console.log(this.props)
        const myCard = this.props.webId
        const projectFolder = myCard.replace('profile/card#me', "public/myProjects/")
        fileClient.readFolder(projectFolder).then(folder => {
            this.setState({myProjects: folder.folders})
        }, err => console.log(err) );
    }

    setActiveProject = (key) => {
        if (key !== 'new_project') {
            this.props.dispatch(setProject(key));
            this.props.dispatch(fetchGraph(key))
        } else {
            this.setState({projectModal: true})
        }
    }

    closeModal = () => {
        this.setState({projectModal: false})
    }

    submitModal = () => {
        let folder = document.getElementById('folder').value
        let newSite = document.getElementById('site').value
        let newBuilding = document.getElementById('building').value
        let newStorey = document.getElementById('storey').value
        let newSpace = document.getElementById('space').value

        console.log(folder, newSite, newBuilding, newStorey, newSpace)

        if (folder.length > 0 && newSite.length > 0 && newBuilding.length > 0 && newStorey.length > 0 && newSpace.length > 0) {

            //check if default and project folder already exist
            const projectFolder = this.props.webId.replace('profile/card#me', "public/myProjects/"+folder)
            const newFileName = projectFolder+'/'+folder+'.ttl'
            console.log(newFileName)
            fileClient.readFolder(projectFolder).then(folder => {
                this.setState({myProjects: folder.folders})
            }, err => {
                console.log(err)
                fileClient.createFolder(projectFolder).then(success => {
                    console.log(`Created folder ${projectFolder}.`);
                    fileClient.createFile(newFileName)
                        .then( fileCreated => {
                            const INST = $rdf.Namespace(newFileName+'#')
                            console.log(`Created file ${fileCreated}.`)

                            const store = $rdf.graph();
                            const fetcher = new $rdf.Fetcher(store);
                            var newFile = store.sym(newFileName);
                            const doc = newFile.doc();

                            fetcher.load(newFileName)
                                .then(response => {

                                    store.add(INST(folder), RDF('type'), FOAF('Project'), doc);
                                    store.add(INST(folder), STG('hasSite'), INST(newSite), doc);
                                    store.add(INST(newSite), RDF('type'), BOT('Site'), doc);
                                    store.add(INST(newSite), BOT('hasBuilding'), INST(newBuilding), doc);
                                    store.add(INST(newBuilding), RDF('type'), BOT('Building'), doc);
                                    store.add(INST(newBuilding), BOT('hasStorey'), INST(newStorey), doc);
                                    store.add(INST(newStorey), RDF('type'), BOT('Storey'), doc);
                                    store.add(INST(newStorey), BOT('hasSpace'), INST(newSpace), doc);
                                    store.add(INST(newSpace), RDF('type'), BOT('Space'), doc);

                                    var graph = $rdf.serialize(doc, store, 'text/turtle');
                                    console.log(graph)

                                    fileClient.updateFile(newFileName, graph).then( success => {
                                        console.log( `Updated ${newFileName}.`)
                                        this.setState({myProjects: [...this.state.myProjects, {type: 'folder', name: folder, url: projectFolder+'/'}]}, () => {

                                                this.setActiveProject(projectFolder+'/')

                                            })
                                    }, err => console.log(err));
                                })

                        }, err => console.log(err) )
                }, err => console.log(err) );
            })

            //add the project to the dropdown menu

            //keep the basic project file as the active project graph

            //set the new project as active project






            this.setState({projectModal: false})
        } else {
            alert('Please fill in all the fields')
        }
    }

    render() {
        const {navigation, toolbar} = this.props;

        let newProjectModal =
            <Modal size="lg" show={this.state.projectModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>First, let's create the some default elements of the new project. You can add more buildings, storeys and spaces later. Please make sure all elements are unique</p>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Projectfolder</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="folder"
                                    id='folder'
                                    placeholder="Folder in your POD, where your project will live (relative to myProjects)"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    {/*<Form.Group as={Row}>*/}
                        {/*<Form.Label column sm={2}>Project</Form.Label>*/}
                        {/*<Col sm={9}>*/}
                            {/*<InputGroup>*/}
                                {/*<Form.Control*/}
                                    {/*name="project"*/}
                                    {/*id='project'*/}
                                    {/*placeholder="Name of your project"*/}
                                {/*/>*/}
                            {/*</InputGroup>*/}
                        {/*</Col>*/}
                    {/*</Form.Group>*/}
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Site</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="site"
                                    id='site'
                                    placeholder="Name of the site"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Building</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="building"
                                    id='building'
                                    placeholder="Name of the default building"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Storey</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="storey"
                                    id='storey'
                                    placeholder="Name of the default storey"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Space</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="space"
                                    id='space'
                                    placeholder="Name of the default space"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={this.submitModal}>
                        Create project
                    </Button>
                    <Button variant="danger" onClick={this.closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


        let DropdownTitle;
        if (this.props.activeProject) {
            if (this.props.activeProject !== 'new_project') {
                let projectTitle = this.props.activeProject.split("/")
                projectTitle = projectTitle[projectTitle.length - 2]
                DropdownTitle = projectTitle
            } else {
                DropdownTitle = 'New Project'
            }
        } else {
            DropdownTitle = 'Active Project'
        }

        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>LBDmanager</Navbar.Brand>
                {navigation ? <Navigation navigation={navigation} /> : ""}
                <Dropdown>
                    <Dropdown.Toggle variant="outline-light">{DropdownTitle}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.state.myProjects.map((proj) => (
                            <Dropdown.Item key={proj.url} eventKey={proj.url} onSelect={this.setActiveProject}>{proj.name}</Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        <Dropdown.Item key="new_project" eventKey="new_project" onSelect={this.setActiveProject}>New Project</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>;
                {toolbar ? <Toolbar toolbar={toolbar}/> : ""}
                {newProjectModal}
            </Navbar>
        );
    };
};

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
        graph: state.graph.graph,
    }
}

export default connect(mapStateToProps)(withAuthorization(NavBar));
