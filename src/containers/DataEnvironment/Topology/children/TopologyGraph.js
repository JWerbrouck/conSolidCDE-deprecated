import React, { Component } from 'react';
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";
import {STG} from "../../../../sparql/namespaces";

class TopologyGraph extends Component {
    constructor(props) {
        super();
        this.state = {};
    }

    componentDidMount() {
        let store = this.props.graph;
        let mainGraph = this.props.activeProject.split("myProjects/")
        mainGraph = this.props.activeProject + mainGraph[mainGraph.length -1].slice(0, -1) + '.ttl'
        this.setState({mainGraph: mainGraph})
        let mainGraphLib = store.sym(mainGraph)
        this.setState({mainGraphLib: mainGraphLib})

        let triples = store.match(null, null, null, mainGraphLib.doc())
        let graph = this.triplesToGraph(triples)
        this.setState({visualGraph: graph})
    }

    triplesToGraph = (triples) => {

        var graph={nodes:[], links:[], triples:[]};

        //Initial Graph from triples
        triples.forEach(function(triple){
            var subjId = triple.subject;
            var predId = triple.predicate;
            var objId = triple.object;

            var subjNode = graph.nodes.filter(function(n) { return n.id === subjId; })[0]
            var objNode  = graph.nodes.filter(function(n) { return n.id === objId; })[0]

            if(subjNode==null){
                subjNode = {id:subjId, label:subjId, weight:1, type:"node"};
                graph.nodes.push(subjNode);
            }

            if(objNode==null){
                objNode = {id:objId, label:objId, weight:1, type:"node"};
                graph.nodes.push(objNode);
            }

            var predNode = {id:predId, label:predId, weight:1, type:"pred"} ;
            graph.nodes.push(predNode);

            var blankLabel = "";

            graph.links.push({source:subjNode, target:predNode, predicate:blankLabel, weight:1});
            graph.links.push({source:predNode, target:objNode, predicate:blankLabel, weight:1});

            graph.triples.push({s:subjNode, p:predNode, o:objNode});

        });

        return graph;
    }




    render() {
        return(
            <div style={divStyle}>
                <p>Placeholder for Graph</p>
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

export default connect(mapStateToProps)(withAuthorization(TopologyGraph));


