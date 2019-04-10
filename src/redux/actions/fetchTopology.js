import {FETCH_TOPOLOGY_BEGIN, FETCH_TOPOLOGY_SUCCESS, FETCH_TOPOLOGY_FAILURE, UPDATE_TOPOLOGY, FETCH_GRAPH_BEGIN, FETCH_GRAPH_FAILURE, FETCH_GRAPH_SUCCESS} from "../constants";
import topoQuery from '../../sparql/topoQuery'


const $rdf = require('rdflib');
const fetcher = new $rdf.Fetcher(store);
const store = $rdf.graph();

// async function getTopology(projectFolder) {
//     let mainGraph = projectFolder.split("myProjects/")
//     mainGraph = projectFolder + mainGraph[mainGraph.length -1].slice(0, -1) + '.ttl'
//     let result = await topoQuery(mainGraph)
//     return result
// }
//
// export function fetchTopology(projectFolder) {
//     if (projectFolder !== 'new_project') {
//         return dispatch => {
//             dispatch(fetchTopologyBegin());
//             return getTopology(projectFolder)
//                 .then(json => {
//                     dispatch(fetchTopologySuccess(json));
//                     return json;
//                 })
//                 .catch(error =>
//                     dispatch(fetchTopologyFailure(error))
//                 );
//         };
//     } else {
//         let json = {
//                 project: {shortName: '', uri: '', newUri: ''},
//                 site: {shortName: '', uri: '', newUri: ''},
//                 hasBuilding: [{
//                 shortName: '',
//                 uri: '',
//                 newUri: '',
//                 hasStorey: [{
//                     shortName: '',
//                     uri: '',
//                     newUri: '',
//                     hasSpace: [{
//                         shortName: '',
//                         uri: '',
//                         newUri: ''
//                     }]
//                 }]
//             }]
//         }
//         return dispatch => {
//             dispatch(fetchTopologySuccess(json))
//             return json
//         }
//     }
// }
//

async function getGraph(projectFolder) {
    let project = projectFolder.split("myProjects/")
    let mainGraph = projectFolder + project[project.length -1].slice(0, -1) + '.ttl'
    let roleGraph = projectFolder + 'stakeholders.ttl'

    let topology = await fetcher.load(mainGraph)
        .then(response => {
            return response.responseText
        })
        .catch(err => console.log(err))
    let roles = await fetcher.load(roleGraph)
        .then(response => {
            return response.responseText
        })
        .catch(err => console.log(err))

    $rdf.parse(topology, store, mainGraph, "text/turtle")
    $rdf.parse(roles, store, roleGraph, "text/turtle")


    // let topology = await fetcher.load(mainGraph)
    //     .then(response => {
    //         try {
    //             $rdf.parse(response.responseText, store, mainGraph, "text/turtle")
    //         } catch (e) {
    //             console.log(e)
    //         }
    //
    //     return store
    // })
    //     .catch(err => console.log(err))
    // let roles = await fetcher.load(roleGraph)
    //     .then(response => {
    //         try {
    //             $rdf.parse(response.responseText, store, roleGraph, "text/turtle")
    //         } catch (e) {
    //             console.log(e)
    //         }
    //
    //         return store
    //     })
    //     .catch(err => console.log(err))

    return store
}

export function fetchGraph(projectFolder) {
    if (projectFolder !== 'new_project') {
        return dispatch => {
            dispatch(fetchGraphBegin());
            return getGraph(projectFolder)
                .then(response => {
                    dispatch(fetchGraphSuccess(response), );
                    return response;
                })
                .catch(error =>
                    dispatch(fetchGraphFailure(error))
                );
        };
    }
}

//
// export const updateTopology = (topology) => {
//     let topoCopy = location
//     let newUri = topoCopy.uri.split("#")[0]
//
//     let keys = e.target.name.split("_")
//     let topoString = 'topology'
//     keys.forEach(k => {
//             topoString = topoString + '["'+k+'"]'
//         }
//     )
//
//     console.log(eval(topoString))
//
//     newUri = newUri + '#' + e.target.value
//
//     topoCopy.newUri = newUri
//     topoCopy.shortUri = e.target.value
//
//     console.log('new', topology)
//
//     return {
//         type: UPDATE_TOPOLOGY,
//         payload: {topology}
//     }
// }
//
// export const fetchTopologyBegin = () => {
//     return {
//         type: FETCH_TOPOLOGY_BEGIN
//     }};
//
// export const fetchTopologySuccess = topology => {
//     return {
//         type: FETCH_TOPOLOGY_SUCCESS,
//         payload: {topology}
//     }
// }
//
// export const fetchTopologyFailure = error => {
//     return {
//         type: FETCH_TOPOLOGY_FAILURE,
//         payload: {error}
//     }
// }


export const fetchGraphBegin = () => {
    return {
        type: FETCH_GRAPH_BEGIN
    }};

export const fetchGraphSuccess = graph => {
    return {
        type: FETCH_GRAPH_SUCCESS,
        payload: {graph}
    }
}

export const fetchGraphFailure = error => {
    return {
        type: FETCH_GRAPH_FAILURE,
        payload: {error}
    }
}
