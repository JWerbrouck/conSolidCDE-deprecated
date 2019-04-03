import React, {Component} from "react";
import { Navigation, Toolbar } from "./children";
import {Navbar, Dropdown, Button} from 'react-bootstrap'
import { withAuthorization } from '@inrupt/solid-react-components';

import {connect} from "react-redux";
import {setProject} from '../../redux/actions/setActiveProject'
import {fetchTopology, fetchGraph} from "../../redux/actions/fetchTopology";

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
        console.log(this.props)
        const myCard = this.props.webId
        const projectFolder = myCard.replace('profile/card#me', "public/myProjects/")
        fileClient.readFolder(projectFolder).then(folder => {
            this.setState({myProjects: folder.folders})
        }, err => console.log(err) );
    }

    setActiveProject = (key) => {
        this.props.dispatch(setProject(key))
        this.props.dispatch(fetchTopology(key))
        this.props.dispatch(fetchGraph(key))
    }

    printProps = (e) => {
        e.preventDefault()
        console.log(this.props)
    }

    render() {
        const {navigation, toolbar} = this.props;

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
                <Button onClick={this.printProps}>printProps</Button>
                {toolbar ? <Toolbar toolbar={toolbar}/> : ""}
            </Navbar>
        );
    };
};

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
        topology: state.topology.topology,
        topoLoading: state.topology.loading,
        topoError: state.topology.error,
        graph: state.graph.graph,
        graphLoading: state.graph.loading,
        graphError: state.graph.error
    }
}
//
// function mapDispatchProps(dispatch) {
//     return bindActionCreators({setProject}, dispatch)
// }

export default connect(mapStateToProps)(withAuthorization(NavBar));
