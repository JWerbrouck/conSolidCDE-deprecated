import React, { Component } from 'react';
import {Button, Container, Row, Form, Col} from 'react-bootstrap'
import TreeComponent from './JSONtree'
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";
import DropdownTreeSelect from "react-dropdown-tree-select";
import './dropdownTree.css'

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const bindingsStreamToGraphQl = require('@comunica/actor-sparql-serialize-tree').bindingsStreamToGraphQl;
const myEngine = newEngine();

const cntxt = {
    "Site": "https://w3id.org/bot#Site",
    "hasBuilding": "https://w3id.org/bot#hasBuilding",
    "hasStorey": "https://w3id.org/bot#hasStorey",
    "hasSpace": "https://w3id.org/bot#hasSpace",
    "a": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
}

const values = [{
    title: 'Node1',
    value: 'rrgqr',
    key: 'sergser',
    children: [{
        title: 'Child Node1',
        value: 'sertv',
        key: 'sertsergsgfd',
    }],
}, {
    title: 'Node2',
    value: 'dsfgsd',
    key: 'qrvqcec',
    children: [{
        title: 'Child Node3',
        value: 'hgjkkghj',
        key: 'gjhkyukgu',
    }, {
        title: 'Child Node4',
        value: 'gyulglyu',
        key: 'zrgheff',
    }, {
        title: 'Child Node5',
        value: 'tserhsrg',
        key: 'tergsrhsfd',
    }],
}];


const qry = `{
    hasStorey
    hasStorey {
        hasSpace
    }
}`

class GraphQLComponent extends Component {
    constructor(props) {
        super();
        this.state = {
            myResults: {},
            queryPerformed: false,
            keys: [],
            addedKeys: []
        };
    }

    componentDidMount() {
        console.log(this.props)
    }

    queryInput = () => {
        return document.getElementById("queryInput").value
    }

    contextInput = () => {
        let endpoint = this.props.endpoint.url
        console.log(endpoint)
        let type = 'file'
        let context = document.getElementById("JSONInput").value

        let finalContext = `{
"sources": [{"type": "%type%", "value": "%endpoint%"}],
"queryFormat": "graphql",
"@context": %context%
}`

        finalContext = finalContext.replace("%type%", type)
        finalContext = finalContext.replace("%endpoint%", endpoint)
        finalContext = finalContext.replace("%context%", context)

        return finalContext
    }

    query = async () => {
        let query = this.queryInput()
        let context = this.contextInput()
        context = JSON.parse(context)
        myEngine.query(query, context)
            .then(function (result) {
                return bindingsStreamToGraphQl(result.bindingsStream, context);
            })
            .then((row) => {
                this.mapKeys(row)
                this.setState({myResults: row},() => {
                    this.setState({queryPerformed: true})
                })
            });
    }

    mapKeys = (arr) => {
        arr.forEach((row) => {
            let keys = Object.keys(row)
            keys.forEach((key) => {
                if (key === 'id') {
                    let el = row[key]
                    el = el.replace(this.props.endpoint.url + '#', '')
                    let full_el = {title: el, value: el, key: el}

                    let addedKeys = this.state.addedKeys
                    let state = this.state.keys

                    if (!addedKeys.includes(el)) {
                        state.push(full_el);
                        addedKeys.push(el)
                    }
                    this.setState({keys: state})
                } else {
                    this.mapKeys(row[key])
                }
            })
        })
    }

    render() {
        let tree
        if (this.state.queryPerformed) {
            tree = <TreeComponent treeData={this.state.keys} data={this.state.myResults}/>
            // tree = <p>{JSON.stringify(this.state.myResults)}</p>
            // tree = <DropdownTreeSelect data={data} onChange={this.onChange} className="bootstrap-demo"/>

        } else {
            tree = <div></div>
        }

        return(
            <Container>
                <hr/>
                <h6>{this.props.endpoint.name}</h6>
                <hr/>
                <Form>
                    <Form.Group className='context' as={Row}>
                        <Form.Label column sm={2}>@context</Form.Label>
                        <Col sm={10}><Form.Control defaultValue={JSON.stringify(cntxt, null, 2)} id="JSONInput" as="textarea" rows="7" /></Col>
                        {/*<Col sm={{ span: 10, offset: 2 }}><input id="input-b2" name="input-b2" type="file" className="file" data-show-preview="false"/></Col>*/}
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>GraphQL query</Form.Label>
                        <Col sm={10}><Form.Control defaultValue={qry} onChange={this.queryInput} id="queryInput" as="textarea" rows="5" /></Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 1, offset: 2 }}>
                            <Button onClick={this.query} variant="dark">Query</Button>
                        </Col>
                        <Col sm={9}>
                            {tree}
                        </Col>
                    </Form.Group>
                </Form>
                <hr/>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
    }
}

export default connect(mapStateToProps)(withAuthorization(GraphQLComponent));
