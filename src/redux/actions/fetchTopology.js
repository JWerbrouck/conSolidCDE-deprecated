import {FETCH_TOPOLOGY_BEGIN, FETCH_TOPOLOGY_SUCCESS, FETCH_TOPOLOGY_FAILURE, UPDATE_TOPOLOGY} from "../constants";
import topoQuery from '../../sparql/topoQuery'

async function getTopology(projectFolder) {
    let mainGraph = projectFolder.split("myProjects/")
    mainGraph = projectFolder + mainGraph[mainGraph.length -1].slice(0, -1) + '.ttl'
    let result = await topoQuery(mainGraph)
    return result
}

export function fetchTopology(projectFolder) {
    if (projectFolder !== 'new_project') {
        return dispatch => {
            dispatch(fetchTopologyBegin());
            return getTopology(projectFolder)
                .then(json => {
                    dispatch(fetchTopologySuccess(json));
                    return json;
                })
                .catch(error =>
                    dispatch(fetchTopologyFailure(error))
                );
        };
    } else {
        let json = {
                project: {shortName: '', uri: '', newUri: ''},
                site: {shortName: '', uri: '', newUri: ''},
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
        return dispatch => {
            dispatch(fetchTopologySuccess(json))
            return json
        }

    }

}

export const updateTopology = (topology) => {
    // let topoCopy = location
    // let newUri = topoCopy.uri.split("#")[0]
    //
    // let keys = e.target.name.split("_")
    // let topoString = 'topology'
    // keys.forEach(k => {
    //         topoString = topoString + '["'+k+'"]'
    //     }
    // )
    //
    // console.log(eval(topoString))
    //
    // newUri = newUri + '#' + e.target.value
    //
    // topoCopy.newUri = newUri
    // topoCopy.shortUri = e.target.value

    console.log('new', topology)

    return {
        type: UPDATE_TOPOLOGY,
        payload: {topology}
    }
}

export const fetchTopologyBegin = () => {
    return {
        type: FETCH_TOPOLOGY_BEGIN
    }};

export const fetchTopologySuccess = topology => {
    return {
        type: FETCH_TOPOLOGY_SUCCESS,
        payload: {topology}
    }
}

export const fetchTopologyFailure = error => {
    return {
        type: FETCH_TOPOLOGY_FAILURE,
        payload: {error}
    }
}
