import React, { Component } from 'react';
import { withAuthorization, Uploader} from '@inrupt/solid-react-components'
import {ProfileUploader} from './ProfileUploader'
import {connect} from "react-redux";
import {CT} from "../../sparql/namespaces";

const $rdf = require('rdflib');
const fileClient = require('solid-file-client');

class UploadComponent extends Component {
    constructor(props) {
        super();
        this.state = {newFile: ''};
    }

    handleUpload = (e) => {
        if (this.props.linkResource) {
            let mainGraph = this.props.activeProject.split("myProjects/");
            mainGraph = this.props.activeProject + mainGraph[mainGraph.length -1].slice(0, -1) + '.ttl'

            let store = this.props.graph

            let fileUri = e[0].uri
            let resourceUri = mainGraph + '#' + this.props.linkResource

            let graph = store.sym(mainGraph)
            const doc = graph.doc()

            let fileRDF = store.sym(fileUri)
            let resourceRDF = store.sym(resourceUri)

            store.add(resourceRDF, CT('hasLink'), fileRDF, doc);

            var finalGraph = $rdf.serialize(doc, store, 'text/turtle');

            fileClient.updateFile(mainGraph, finalGraph).then( success => {
                console.log( `Updated ${mainGraph}.`)
            }, err => console.log(err));

        }

        if (this.props.addDoc) {
            this.props.addDoc()
        }

    }


    render() {
        return(
            <div>
                <Uploader
                    {...{
                        onComplete: e => this.handleUpload(e),
                        fileBase: this.props.activeProject,
                        render: props => <ProfileUploader {...{ ...props }} />
                    }}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
        graph: state.graph.graph
    }
}

export default connect(mapStateToProps)(withAuthorization(UploadComponent));
