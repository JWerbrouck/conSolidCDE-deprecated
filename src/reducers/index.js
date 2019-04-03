// import {SET_PROJECT, FETCH_TOPOLOGY_FAILURE, FETCH_TOPOLOGY_SUCCESS, FETCH_TOPOLOGY_BEGIN} from "../constants";
// import topoQuery from '../sparql/topoQuery'
//
//
const setActiveProject = (action) => {
    let topology
    if (action.url !== 'new_project') {
        let mainGraph = action.url.split("myProjects/")
        mainGraph = action.url + mainGraph[mainGraph.length -1].slice(0, -1) + '.ttl'
        console.log(mainGraph)
        topoQuery(mainGraph)
            .then(topology => {
                console.log('topology', topology)
                return {
                    url: action.url,
                    id: Math.random(),
                    topology: {test: 'test'}
                };
            }, err => console.log(err))

    } else {
        topology = {
            project: '',
            site: '',
            hasBuilding: [{
                shortName: '',
                uri: '',
                newUri: '',
                hasStorey: [{
                    shortName: '',
                    uri: '',
                    newUri: '',
                    hasSpace: [{
                        shortName: '',
                        uri: '',
                        newUri: ''
                    }]
                }]
            }]
        }

        return {
            url: action.url,
            id: Math.random()
        };
    }
}
//
// const reducers = (state = '', action) => {
//     switch (action.type) {
//         case SET_PROJECT:
//             let actProj = setActiveProject(action)
//             return actProj
//         default:
//             return state
//     }
// }
//
// export default reducers
