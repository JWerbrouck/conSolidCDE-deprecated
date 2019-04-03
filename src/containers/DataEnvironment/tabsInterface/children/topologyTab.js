import React, { Component } from 'react';
import {Button} from "react-bootstrap";

import {connect} from "react-redux";
import {setProject} from '../../../../actions'
import {bindActionCreators} from "redux";

import {withAuthorization} from "@inrupt/solid-react-components";


class TopologyTab extends Component {
    constructor(props) {
        super();
        this.state = {
        };
    }

    printProps = () => {
        console.log('myprops:', this.props)
    }

    render() {
        return(
            <div>
                <Button onClick={this.printProps}>Press</Button>
            </div>
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

export default connect(mapStateToProps, mapDispatchProps)(withAuthorization(TopologyTab));
