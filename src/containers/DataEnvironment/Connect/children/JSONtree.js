import React, { Component } from 'react';
import {TreeSelect} from 'antd';
import 'antd/dist/antd.css';
import {Button} from "react-bootstrap";

// const data = [{
//     title: 'Node1',
//     value: 'rrgqr',
//     key: 'sergser',
//     children: [{
//         title: 'Child Node1',
//         value: 'sertv',
//         key: 'sertsergsgfd',
//     }],
// }, {
//     title: 'Node2',
//     value: 'dsfgsd',
//     key: 'qrvqcec',
//     children: [{
//         title: 'Child Node3',
//         value: 'hgjkkghj',
//         key: 'gjhkyukgu',
//     }, {
//         title: 'Child Node4',
//         value: 'gyulglyu',
//         key: 'zrgheff',
//     }, {
//         title: 'Child Node5',
//         value: 'tserhsrg',
//         key: 'tergsrhsfd',
//     }],
// }];

class TreeComponent extends Component {
    state = {
        keys: []
    }

    onChange = (value) => {
        console.log('onChange ', value);
        this.setState({ value });
    }

    render() {
        const tProps = {
            treeData: this.props.treeData,
            value: this.state.value,
            onChange: this.onChange,
            treeCheckable: true,
            showCheckedStrategy: TreeSelect.SHOW_ALL,
            treeCheckStrictly: true,
            searchPlaceholder: 'Click for results',
        };
        return (
            <div>
                <TreeSelect {...tProps} />
            </div>

        )
    }
}

export default TreeComponent
