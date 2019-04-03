import {FETCH_TOPOLOGY_BEGIN, FETCH_TOPOLOGY_SUCCESS, FETCH_TOPOLOGY_FAILURE, UPDATE_TOPOLOGY} from "../constants";

const initialState = {
    topology: {},
    loading: false,
    error: null
}

export default function topoReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TOPOLOGY_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_TOPOLOGY_SUCCESS:
            return {
                ...state,
                loading: false,
                topology: action.payload.topology
            };

        case FETCH_TOPOLOGY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                topology: {}
            };

        case UPDATE_TOPOLOGY:
            console.log('new topology', action.payload.topology)
            return {
                ...state,
                topology: action.payload.topology
            };

        default:
            return state
    }

};
