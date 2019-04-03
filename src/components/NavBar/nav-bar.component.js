import React, {Component} from "react";
import { Link } from "react-router-dom";
import { Navigation, Toolbar } from "./children";
import {Navbar, Nav, Dropdown, NavItem, Col, InputGroup, FormControl, DropdownButton} from 'react-bootstrap'
import { withAuthorization } from '@inrupt/solid-react-components';

import {connect} from "react-redux";
import {setProject} from '../../actions'
import {bindActionCreators} from "redux";

const fileClient = require('solid-file-client');

type Props = { navigation: Array<Object>, toolbar: Array<React.Node> };

class NavBar extends Component {
    constructor(props: Props) {
        super();
        this.state = {
            myProjects: [],
            showNewProject: false
        };
    }

    componentDidMount() {
        //fetch the projects in the Private/myProjects folder of my webID
        const myCard = this.props.webId
        const projectFolder = myCard.replace('profile/card#me', "public/myProjects/")
        fileClient.readFolder(projectFolder).then(folder => {
            this.setState({myProjects: folder.folders})
        }, err => console.log(err) );
    }

    setActiveProject = (key) => {
        console.log(key)
        this.props.setProject(key)
    }

    render() {
        const {navigation, toolbar} = this.props;

        let DropdownTitle
        if (this.props.activeProject) {
            if (this.props.activeProject.url !== 'new_project') {
                let projectTitle = this.props.activeProject.url.split("/")
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
            </Navbar>
        );
    };
};

function mapStateToProps(state) {
    console.log('state', state)
    return {
        activeProject: state
    }
}

function mapDispatchProps(dispatch) {
    return bindActionCreators({setProject}, dispatch)
}

export default connect(mapStateToProps, mapDispatchProps)(withAuthorization(NavBar));
