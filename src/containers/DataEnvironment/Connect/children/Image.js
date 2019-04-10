import React, { Component } from 'react';
import {Container} from 'react-bootstrap'

class Canvas extends Component {
    constructor(props) {
        super();
        this.state = {
        };
    }

    // componentDidMount() {
    //     const canvas = this.refs.canvas
    //     const ctx = canvas.getContext("2d")
    //     const img = this.refs.image
    //
    //     img.onload = () => {
    //         ctx.drawImage(img, 0, 0)
    //         ctx.font = "40px Courier"
    //         ctx.fillText(this.props.text, 210, 75)
    //     }
    // }

    render() {
        return(
            <Container >
                <hr/>
                <h3>{this.props.document.name}</h3>
                {/*<canvas ref="canvas" width={640} height={425} />*/}
                <img ref="image" src={this.props.document.url} className="hidden" />
                <hr/>
            </Container>
        )
    }
}

// const containerStyle = {
//
// }

export default Canvas
