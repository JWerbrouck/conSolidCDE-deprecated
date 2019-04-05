import React, { Component } from 'react';
import {connect} from "react-redux";
import {withAuthorization} from "@inrupt/solid-react-components";
import {BOT, RDF, STG} from "../../../../sparql/namespaces";

import {Container, Form, Button, Col, InputGroup, Row, Dropdown, DropdownButton, FormControl, Modal} from "react-bootstrap";
const $rdf = require('rdflib');

class TopologyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buildingModal: false,
            storeyModal: false,
            spaceModal: false,
            projectValid: true,
            siteValid: true,
            buildingValid: true,
            storeyValid: true,
            spaceValid: true,
            buildingActive: '',
            storeyActive: '',
            spaceActive: '',
        }
    }

    componentWillMount() {
        let store = this.props.graph;
        let mainGraph = this.props.activeProject.split("myProjects/")
        mainGraph = this.props.activeProject + mainGraph[mainGraph.length -1].slice(0, -1) + '.ttl'
        this.setState({mainGraph: mainGraph})
        let mainGraphLib = store.sym(mainGraph)
        this.setState({mainGraphLib: mainGraphLib})

        try {
            let projectUri = store.match(null, STG('hasSite'), null, mainGraphLib.doc())[0].subject.value
            let project = projectUri.replace(mainGraph+'#', '')
            this.setState({projectActive: project})
            this.setState({projectActiveInitial: project})

            let siteUri = store.match(null, STG('hasSite'), null, mainGraphLib.doc())[0].object.value
            let site = siteUri.replace(mainGraph+'#', '')
            this.setState({siteActive: site})
            this.setState({siteActiveInitial: site})

            let buildingActiveUri = store.match(null, BOT('hasBuilding'), null, mainGraphLib.doc())[0].object.value
            let buildingActive = buildingActiveUri.replace(mainGraph + '#', '')
            this.setState({buildingActive: buildingActive}, () => {

                this.setState({buildingActiveInitial: project})
                let storeyActiveUri = store.match(store.sym(buildingActiveUri), BOT('hasStorey'), null, mainGraphLib.doc())[0].object.value
                let storeyActive = storeyActiveUri.replace(mainGraph + '#', '')
                this.setState({storeyActive: storeyActive}, () => {

                    this.setState({storeyActiveInitial: storeyActive})
                    let spaceActiveUri = store.match(store.sym(storeyActiveUri), BOT('hasSpace'), null, mainGraphLib.doc())[0].object.value
                    let spaceActive = spaceActiveUri.replace(mainGraph + '#', '')
                    this.setState({spaceActive: spaceActive})
                    this.setState({spaceActiveInitial: spaceActive})
                })
            })
        } catch {}
    }

    nameChanged = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (e.target.value.length > 0) {
                console.log(e.target.value)

                let store = this.props.graph;

                let oldUri = store.sym(this.state.mainGraph + "#" + this.state[e.target.name+'ActiveInitial'])
                let newUri = store.sym(this.state.mainGraph + "#" + e.target.value)

                let subs = store.match(oldUri, null, null, this.state.mainGraphLib.doc())
                let obs = store.match(null, null, oldUri, this.state.mainGraphLib.doc())
                for (const row of subs) {
                    console.log('row', row)

                    let ss = row.subject
                    let ps = row.predicate
                    let os = row.object

                    store.add(newUri, ps, os, this.state.mainGraphLib.doc());
                    let del = $rdf.st(ss, ps, os, this.state.mainGraphLib.doc())
                    store.removeStatement(del)
                }


                for (const row of obs) {
                    console.log('row', row)
                    let so = row.subject
                    let po = row.predicate
                    let oo = row.object

                    store.add(so, po, newUri, this.state.mainGraphLib.doc())
                    let del2 = $rdf.st(so, po, oo, this.state.mainGraphLib.doc())
                    store.removeStatement(del2)
                }

                console.log($rdf.serialize(this.state.mainGraphLib.doc(), store, this.state.mainGraph, 'text/turtle'));
                this.setState({[e.target.name+'Valid']: true})
                this.setState({[e.target.name+'Active']: e.target.value})
                this.setState({[e.target.name+'ActiveInitial']: e.target.value})
            }
        }
    }

    setInvalid = (e) => {
        this.setState({[e.target.name+'Active']: e.target.value})
        let stateLocation = e.target.name + 'Valid'
        if (this.state[stateLocation] === true) {
            this.setState({[stateLocation]: false})
        }

        if (e.target.value === this.state[e.target.name + 'Active'] && this.state[stateLocation] === false) {
            this.setState({[stateLocation]: true})
        }
    }

    getZones = (zone) => {
        let store = this.props.graph;

        const myArray = []

        let subject
        if (zone === 'building') {
            subject = store.match(null, STG('hasSite'), null, this.state.mainGraphLib.doc())[0].object
        } else if (zone === 'storey') {
            subject = store.sym(this.state.mainGraph + '#' + this.state.buildingActive)
        } else if (zone === 'space') {
            subject = store.sym(this.state.mainGraph + '#' + this.state.storeyActive)
        }

        let predicate
        if (zone === 'building') {
            predicate = BOT('hasBuilding')
        } else if (zone === 'storey') {
            predicate = BOT('hasStorey');
        } else if (zone === 'space') {
            predicate = BOT('hasSpace');
        }

        let res
        res = store.match(subject, predicate, null, this.state.mainGraphLib.doc())
        try {
            res.forEach(r => {
                let name = r.object.value
                name = name.replace(this.state.mainGraph+'#', '')
                myArray.push(name)
            })
            return myArray
        } catch {
            return myArray
        }
    }

    selectNewBuilding = (e) => {
        let store = this.props.graph;
        this.state.buildingActive = e.target.name
        this.state.buildingActiveInitial = e.target.name

        let storeyActiveUri = store.match(store.sym(this.state.mainGraph + '#' + this.state.buildingActive), BOT('hasStorey'), null, this.state.mainGraphLib.doc())[0].object.value
        let storeyActive = storeyActiveUri.replace(this.state.mainGraph + '#', '')
        this.state.storeyActive = storeyActive
        this.state.storeyActiveInitial = storeyActive

        let spaceActiveUri = store.match(store.sym(this.state.mainGraph + '#' + this.state.storeyActive), BOT('hasSpace'), null, this.state.mainGraphLib.doc())[0].object.value
        let spaceActive = spaceActiveUri.replace(this.state.mainGraph + '#', '')
        this.setState({spaceActive: spaceActive})
        this.setState({spaceActiveInitial: spaceActive})

    }

    selectNewStorey = (e) => {
        let store = this.props.graph;

        this.state.storeyActive =  e.target.name

        let spaceActiveUri = store.match(store.sym(this.state.mainGraph + '#' + this.state.storeyActive), BOT('hasSpace'), null, this.state.mainGraphLib.doc())[0].object.value
        let spaceActive = spaceActiveUri.replace(this.state.mainGraph + '#', '')
        this.setState({spaceActive: spaceActive})

        this.setState({storeyActiveInitial: e.target.name})
        this.setState({spaceActiveInitial: spaceActive})
    }

    selectNewSpace = (e) => {
        console.log(e.target.name)
        this.setState({spaceActive: e.target.name})

        this.setState({spaceActiveInitial: e.target.name})

        console.log(this.state)
    }

    // valueQuery = (name) => {
    //     let store = this.props.graph;
    //     let this.state.mainGraph = this.props.activeProject.split("myProjects/")
    //     mainGraph = this.props.activeProject + mainGraph[mainGraph.length -1].slice(0, -1) + '.ttl'
    //     let mainGraphLib = store.sym(mainGraph)
    //
    //     let res
    //     switch (name) {
    //         case 'project':
    //             res = store.match(null, STG('hasSite'), null, mainGraphLib.doc())
    //             try {
    //                 res = res[0].subject
    //                 res = res.value.replace(mainGraph+'#', '')
    //                 return res
    //             } catch (e) {
    //                 return e
    //             }
    //         case 'site':
    //             res = store.match(null, STG('hasSite'), null, mainGraphLib.doc())
    //             try {
    //                 res = res[0].object
    //                 res = res.value.replace(mainGraph+'#', '')
    //                 return res
    //             } catch (e) {
    //                 return e
    //             }
    //     }
    //
    // }

    printProps = (e) => {
        e.preventDefault()
        console.log(this.state)
    }

    addNewBuilding = () => {
        let store = this.props.graph;
        let INST = $rdf.Namespace(this.state.mainGraph+'#')

        let site = INST(this.state.siteActiveInitial)
        let newBuilding = document.getElementById('buildingNew').value
        let newStorey = document.getElementById('storeyNew').value
        let newSpace = document.getElementById('spaceNew').value

        if (newBuilding.length > 0 && newStorey.length > 0 && newSpace.length > 0) {
            store.add(site,BOT('hasBuilding'), INST(newBuilding), this.state.mainGraphLib.doc());
            store.add(INST(newBuilding), RDF('type'), BOT('Building'), this.state.mainGraphLib.doc())
            store.add(INST(newBuilding), BOT('hasStorey'), INST(newStorey), this.state.mainGraphLib.doc())
            store.add(INST(newStorey), RDF('type'), BOT('Storey'), this.state.mainGraphLib.doc())
            store.add(INST(newStorey), BOT('hasSpace'), INST(newSpace), this.state.mainGraphLib.doc())
            store.add(INST(newSpace), RDF('type'), BOT('Space'), this.state.mainGraphLib.doc())

            this.state.buildingActive = newBuilding
            this.state.buildingActiveInitial = newBuilding

            this.state.storeyActive = newStorey
            this.state.storeyActiveInitial = newStorey

            this.state.spaceActive = newSpace
            this.state.spaceActiveInitial = newSpace

            console.log($rdf.serialize(this.state.mainGraphLib.doc(), store, this.state.mainGraph, 'text/turtle'));

            this.setState({buildingModal: false})
        }


    }

    addNewStorey = () => {
        let store = this.props.graph;
        let INST = $rdf.Namespace(this.state.mainGraph+'#')

        let newStorey = document.getElementById('storeyNew').value
        let newSpace = document.getElementById('spaceNew').value

        if (newStorey.length > 0 && newSpace.length > 0) {
            store.add(INST(this.state.buildingActiveInitial), BOT('hasStorey'), INST(newStorey), this.state.mainGraphLib.doc());
            store.add(INST(newStorey), RDF('type'), BOT('Storey'), this.state.mainGraphLib.doc())
            store.add(INST(newStorey), BOT('hasSpace'), INST(newSpace), this.state.mainGraphLib.doc())
            store.add(INST(newSpace), RDF('type'), BOT('Space'), this.state.mainGraphLib.doc())

            this.state.storeyActive = newStorey
            this.state.storeyActiveInitial = newStorey

            this.state.spaceActive = newSpace
            this.state.spaceActiveInitial = newSpace

            console.log($rdf.serialize(this.state.mainGraphLib.doc(), store, this.state.mainGraph, 'text/turtle'));

            this.setState({storeyModal: false})

        } else {
            console.log('please complete all fields')
        }

    }

    addNewSpace = () => {
        let store = this.props.graph;
        let INST = $rdf.Namespace(this.state.mainGraph+'#')

        let newSpace = document.getElementById('spaceNew').value

        if (newSpace.length > 0) {
            store.add(INST(this.state.storeyActiveInitial), BOT('hasSpace'), INST(newSpace), this.state.mainGraphLib.doc());
            store.add(INST(newSpace), RDF('type'), BOT('Space'), this.state.mainGraphLib.doc())

            this.state.spaceActive = newSpace
            this.state.spaceActiveInitial = newSpace

            console.log($rdf.serialize(this.state.mainGraphLib.doc(), store, this.state.mainGraph, 'text/turtle'));

            this.setState({spaceModal: false})

        } else {
            console.log('please complete all fields')
        }

    }

    removeBuilding = () => {
        let store = this.props.graph;
        let INST = $rdf.Namespace(this.state.mainGraph+'#')

        if (store.match(INST(this.state.siteActive), BOT('hasBuilding'), null, this.state.mainGraphLib.doc()).length > 1){
            
            let deleteBuilding = this.state.buildingActive;

            let subs = store.match(INST(deleteBuilding), null, null, this.state.mainGraphLib.doc())
            let obs = store.match(null, null, INST(deleteBuilding), this.state.mainGraphLib.doc())

            for (const row of subs) {
                let ps = row.predicate
                let os = row.object

                //delete child storey occurences from graph
                let childStoreys = store.match(os, null, null, this.state.mainGraphLib.doc())
                for (const childStorey of childStoreys) {
                    console.log('removing child storey', childStorey)
                    let storeyPs = childStorey.predicate;
                    let storeyOs = childStorey.object;

                    //delete child space occurences from graph
                    let childSpaces = store.match(storeyOs, null, null, this.state.mainGraphLib.doc())
                    for (const childSpace of childSpaces) {
                        console.log('removing child space', childSpace)
                        let spacePs = childSpace.predicate;
                        let spaceOs = childSpace.object;
                        let spaceDel = $rdf.st(storeyOs, spacePs, spaceOs, this.state.mainGraphLib.doc())
                        store.removeStatement(spaceDel)
                    }
                    let storeyDel = $rdf.st(os, storeyPs, storeyOs, this.state.mainGraphLib.doc())
                    store.removeStatement(storeyDel)
                }
                let del = $rdf.st(INST(deleteBuilding), ps, os, this.state.mainGraphLib.doc())
                store.removeStatement(del)
            }

            for (const row of obs) {
                console.log('occurence where object', row)
                let so = row.subject
                let po = row.predicate

                let del2 = $rdf.st(so, po, INST(deleteBuilding), this.state.mainGraphLib.doc())
                store.removeStatement(del2)
            }

            console.log($rdf.serialize(this.state.mainGraphLib.doc(), store, this.state.mainGraph, 'text/turtle'));

            let buildingActiveUri = store.match(null, BOT('hasBuilding'), null, this.state.mainGraphLib.doc())[0].object.value
            let buildingActive = buildingActiveUri.replace(this.state.mainGraph + '#', '')
            this.setState({buildingActive: buildingActive}, () => {

                let storeyActiveUri = store.match(INST(this.state.buildingActive), BOT('hasStorey'), null, this.state.mainGraphLib.doc())[0].object.value
                let storeyActive = storeyActiveUri.replace(this.state.mainGraph + '#', '')
                this.setState({storeyActive: storeyActive}, () => {

                    this.setState({storeyActiveInitial: storeyActive})
                    let spaceActiveUri = store.match(INST(this.state.storeyActive), BOT('hasSpace'), null, this.state.mainGraphLib.doc())[0].object.value
                    let spaceActive = spaceActiveUri.replace(this.state.mainGraph + '#', '')
                    this.setState({spaceActive: spaceActive})
                    this.setState({spaceActiveInitial: spaceActive})
                })
            })

        } else {
            alert('A site must have at least one building')
        }
    }

    removeStorey = () => {
        let store = this.props.graph;
        let INST = $rdf.Namespace(this.state.mainGraph+'#')

        if (store.match(INST(this.state.buildingActive), BOT('hasStorey'), null, this.state.mainGraphLib.doc()).length > 1){
            let deleteStorey = this.state.storeyActive;

            let subs = store.match(INST(deleteStorey), null, null, this.state.mainGraphLib.doc())
            let obs = store.match(null, null, INST(deleteStorey), this.state.mainGraphLib.doc())
            for (const row of subs) {
                let ps = row.predicate
                let os = row.object
                let childSpaces = store.match(row.object, null, null, this.state.mainGraphLib.doc())
                for (const childrow of childSpaces) {
                    let childps = childrow.predicate;
                    let childos = childrow.object;

                    let childDel = $rdf.st(os, childps, childos, this.state.mainGraphLib.doc())
                    store.removeStatement(childDel)
                }
                let del = $rdf.st(INST(deleteStorey), ps, os, this.state.mainGraphLib.doc())
                store.removeStatement(del)
            }

            for (const row of obs) {
                console.log('occurence where object', row)
                let so = row.subject
                let po = row.predicate

                let del2 = $rdf.st(so, po, INST(deleteStorey), this.state.mainGraphLib.doc())
                store.removeStatement(del2)
            }

            console.log($rdf.serialize(this.state.mainGraphLib.doc(), store, this.state.mainGraph, 'text/turtle'));

            let storeyActiveUri = store.match(INST(this.state.buildingActive), BOT('hasStorey'), null, this.state.mainGraphLib.doc())[0].object.value
            let storeyActive = storeyActiveUri.replace(this.state.mainGraph + '#', '')
            this.setState({storeyActive: storeyActive}, () => {

                this.setState({storeyActiveInitial: storeyActive})
                let spaceActiveUri = store.match(INST(this.state.storeyActive), BOT('hasSpace'), null, this.state.mainGraphLib.doc())[0].object.value
                let spaceActive = spaceActiveUri.replace(this.state.mainGraph + '#', '')
                this.setState({spaceActive: spaceActive})
                this.setState({spaceActiveInitial: spaceActive})
            })

        } else {
            alert('A building must have at least one storey')
        }
    }

    removeSpace = () => {
        let store = this.props.graph;
        let INST = $rdf.Namespace(this.state.mainGraph+'#')
        if (store.match(INST(this.state.storeyActive), BOT('hasSpace'), null, this.state.mainGraphLib.doc()).length > 1){
            let deleteSpace = this.state.spaceActive;

            let subs = store.match(INST(deleteSpace), null, null, this.state.mainGraphLib.doc())
            let obs = store.match(null, null, INST(deleteSpace), this.state.mainGraphLib.doc())
            for (const row of subs) {
                let ps = row.predicate
                let os = row.object

                let del = $rdf.st(INST(deleteSpace), ps, os, this.state.mainGraphLib.doc())
                store.removeStatement(del)
            }

            for (const row of obs) {
                let so = row.subject
                let po = row.predicate

                let del2 = $rdf.st(so, po, INST(deleteSpace), this.state.mainGraphLib.doc())
                store.removeStatement(del2)
            }

            console.log($rdf.serialize(this.state.mainGraphLib.doc(), store, this.state.mainGraph, 'text/turtle'));

            let spaceActiveUri = store.match(INST(this.state.storeyActive), BOT('hasSpace'), null, this.state.mainGraphLib.doc())[0].object.value
            let spaceActive = spaceActiveUri.replace(this.state.mainGraph + '#', '')
            this.setState({spaceActive: spaceActive})
            this.setState({spaceActiveInitial: spaceActive})

        } else {
            alert('A storey must have at least one space')
        }
    }

    openZoneModal = (zone) => {
        this.setState({[zone+'Modal']: true})
    }

    closeModal = (zone) => {
        this.setState({[zone+'Modal']: false})
    }

    render() {
        let buildings = this.getZones('building').map((building) => {
            return <Dropdown.Item onClick={this.selectNewBuilding} key={building} name={building}>{building}</Dropdown.Item>
        })

        let storeys = this.getZones('storey').map((storey) => {
            return <Dropdown.Item onClick={this.selectNewStorey} key={storey} name={storey}>{storey}</Dropdown.Item>
        })

        let spaces = this.getZones('space').map((space) => {
            return <Dropdown.Item onClick={this.selectNewSpace} key={space} name={space}>{space}</Dropdown.Item>
        })

        let BuildingModal =
            <Modal show={this.state.buildingModal} onHide={() => {this.closeModal('building')}}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new Building</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>New Building</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="buildingNew"
                                    id='buildingNew'
                                    placeholder="New Building"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>New Storey</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="storeyNew"
                                    id='storeyNew'
                                    placeholder="New Storey"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>New Space</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="spaceNew"
                                    id='spaceNew'
                                    placeholder="New Space"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={this.addNewBuilding}>
                        Create
                    </Button>
                    <Button variant="danger" onClick={() => {this.closeModal('building')}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        let StoreyModal =
            <Modal show={this.state.storeyModal} onHide={() => {this.closeModal('storey')}}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new Storey</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>New Storey</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="storeyNew"
                                    id='storeyNew'
                                    placeholder="New Storey"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>New Space</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="spaceNew"
                                    id='spaceNew'
                                    placeholder="New Space"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={this.addNewStorey}>
                        Create
                    </Button>
                    <Button variant="danger" onClick={() => {this.closeModal('storey')}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        let SpaceModal =
            <Modal show={this.state.spaceModal} onHide={() => {this.closeModal('space')}}>
                <Modal.Header closeButton>
                    <Modal.Title>Add new Space</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>New Space</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    name="spaceNew"
                                    id='spaceNew'
                                    placeholder="New Space"
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={this.addNewSpace}>
                        Create
                    </Button>
                    <Button variant="danger" onClick={() => {this.closeModal('space')}}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        return (
            <Container>
                <Form>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Project Name</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    value={this.state.projectActive}
                                    name="project"
                                    id='project'
                                    placeholder="Project Name"
                                    onKeyPress={e => this.nameChanged(e)}
                                    isValid={this.state.projectValid}
                                    isInvalid={!this.state.projectValid}
                                    onChange={e => this.setInvalid(e)}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Site Name</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <Form.Control
                                    value={this.state.siteActive}
                                    name="site"
                                    id='site'
                                    placeholder="Site Name"
                                    onKeyPress={e => this.nameChanged(e)}
                                    isValid={this.state.siteValid}
                                    isInvalid={!this.state.siteValid}
                                    onChange={e => this.setInvalid(e)}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Buildings</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <DropdownButton as={InputGroup.Prepend} variant="dark" title=""
                                                id="input-group-dropdown-2">
                                    {buildings}
                                </DropdownButton>
                                <FormControl
                                    name="building"
                                    placeholder="New Building"
                                    id='building'
                                    value={this.state.buildingActive}
                                    onKeyPress={e => this.nameChanged(e)}
                                    isValid={this.state.buildingValid}
                                    isInvalid={!this.state.buildingValid}
                                    onChange={e => this.setInvalid(e)}
                                />
                                <InputGroup.Append><Button onClick={() => {this.openZoneModal('building')}} variant="dark">Add</Button></InputGroup.Append>
                                <InputGroup.Append><Button onClick={this.removeBuilding} variant="dark">Remove</Button></InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Storeys</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <DropdownButton as={InputGroup.Prepend} variant="dark" title=""
                                                id="input-group-dropdown-2">
                                    {storeys}
                                </DropdownButton>
                                <FormControl
                                    name="storey"
                                    placeholder="New Storey"
                                    id='storey'
                                    value={this.state.storeyActive}
                                    onKeyPress={e => this.nameChanged(e)}
                                    isValid={this.state.storeyValid}
                                    isInvalid={!this.state.storeyValid}
                                    onChange={e => this.setInvalid(e)}
                                />
                                <InputGroup.Append><Button onClick={() => {this.openZoneModal('storey')}} variant="dark">Add</Button></InputGroup.Append>
                                <InputGroup.Append><Button onClick={this.removeStorey} variant="dark">Remove</Button></InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>Spaces</Form.Label>
                        <Col sm={9}>
                            <InputGroup>
                                <DropdownButton as={InputGroup.Prepend} variant="dark" title=""
                                                id="input-group-dropdown-2">
                                    {spaces}
                                </DropdownButton>
                                <FormControl
                                    name="space"
                                    placeholder="New Space"
                                    id='space'
                                    value={this.state.spaceActive}
                                    onKeyPress={e => this.nameChanged(e)}
                                    isValid={this.state.spaceValid}
                                    isInvalid={!this.state.spaceValid}
                                    onChange={e => this.setInvalid(e)}
                                />
                                <InputGroup.Append><Button onClick={() => {this.openZoneModal('space')}} variant="dark">Add</Button></InputGroup.Append>
                                <InputGroup.Append><Button onClick={this.removeSpace} variant="dark">Remove</Button></InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                    <Button onClick={this.printProps} variant="primary" type="submit">
                        Push
                    </Button>
                </Form>
                {BuildingModal}
                {StoreyModal}
                {SpaceModal}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        activeProject: state.activeProject.url,
        graph: state.graph.graph,
    }
}

export default connect(mapStateToProps)(withAuthorization(TopologyForm));
