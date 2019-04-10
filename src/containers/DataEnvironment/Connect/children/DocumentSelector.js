import React, { Component } from 'react';
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";
import {Button, Col, Row, Container} from "react-bootstrap";
import Select from 'react-select'
import UploadComponent from "../../UploadComponent";
import Canvas from './Image'
import GraphQLComponent from './GraphQLComponent'

const fileClient = require('solid-file-client');
const $rdf = require('rdflib');

class DocumentSelector extends Component {
    constructor(props) {
        super();
        this.state = {
            documents: [],
            selectedOption: []
        };
    }

    componentDidMount() {
        fileClient.readFolder(this.props.activeProject).then(folder => {
            console.log(folder)

            let documentOptions = []
            folder.files.forEach(file => {
                file['value'] = file.name
                documentOptions.push(file)
            })

            this.setState({documents: folder.files})
        }, err => console.log(err) );
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    }

    printSelection = () => {
        console.log(this.state.selectedOption)
    }

    addDoc = () => {
        this.componentDidMount()
    }

    render() {
        let documents = this.state.selectedOption.map(document => {
            switch (document.type) {
                case 'image/jpeg':
                    return (
                    <div>
                        <Canvas document={document}/>
                    </div>
                    )
                case 'text/turtle':
                    return (
                        <GraphQLComponent endpoint={document}/>
                    )
                default:
                    return <p key={document.url}>{document.name}</p>

            }
        })

        return(
            <Container style={divStyle}>
                <Row>
                    <Col sm={2}>
                        <UploadComponent addDoc={this.addDoc}/>
                    </Col>
                    <Col sm={10}>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChange}
                            options={this.state.documents}
                            placeholder='Project Documents'
                            isMulti
                        />
                    </Col>
                </Row>
                {documents}


            </Container>
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

export default connect(mapStateToProps)(withAuthorization(DocumentSelector));
