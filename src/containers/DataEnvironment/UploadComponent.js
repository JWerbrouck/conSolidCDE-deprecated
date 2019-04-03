import React, { Component } from 'react';
import {withWebId, withAuthorization, Uploader, ProfileUploader} from '@inrupt/solid-react-components'
import {Button} from "react-bootstrap";

class UploadComponent extends Component {
    constructor(props) {
        super();
        this.state = {};
    }

    printProps = () => {
        console.log(this.props)
    }

    render() {

        return(
            <div>
                {/*<p>{this.props.webId}</p>*/}
                <Uploader
                    {...{
                        fileBase: 'https://jwerbrouck.solid.community/public/',
                        render: props => <ProfileUploader {...{ ...props }} />
                    }}
                />
                <Button onClick={this.printProps}>Click</Button>
            </div>
        )
    }
}

export default withAuthorization(UploadComponent)
